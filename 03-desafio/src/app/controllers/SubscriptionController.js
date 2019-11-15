import * as Yup from 'yup';
import { startOfDay, endOfDay, addMonths } from 'date-fns';
import { Op } from 'sequelize';
import Subscription from '../models/Subscription';
import Student from '../models/Student';
import Plan from '../models/Plan';
import Queue from '../../lib/Queue';
import SubscriptionMail from '../jobs/SubscriptionMail';

class SubscriptionController {
    async store(request, response) {
        const schema = Yup.object().shape({
            student_id: Yup.number()
                .integer()
                .required(),
            plan_id: Yup.number()
                .integer()
                .required(),
            start_date: Yup.date()
                .required()
                .min(startOfDay(new Date())),
        });

        if (!schema.isValidSync()) {
            return response.status(400).json({ error: 'Validation fails' });
        }

        const subscription = schema.cast(request.body);

        const student = await Student.findByPk(subscription.student_id);
        if (!student) {
            return response
                .status(404)
                .json({ error: 'Student was not found' });
        }

        const plan = await Plan.findByPk(subscription.plan_id);
        if (!plan) {
            return response.status(404).json({ error: 'Plan was not found' });
        }

        /**
         *  Normalizing start_date
         */
        subscription.start_date = startOfDay(subscription.start_date);
        /**
         * Calculating and normalizing subscription end_date
         */
        subscription.end_date = endOfDay(
            addMonths(subscription.start_date, plan.duration)
        );
        /**
         * Calculating subscription price
         */
        subscription.price = plan.price * plan.duration;

        /**
         * Checking if the user already has a subscription for the specified plan in the same period of time
         */
        const existsSubscription = await Subscription.findAll({
            where: {
                student_id: subscription.student_id,
                plan_id: subscription.plan_id,
                start_date: {
                    [Op.between]: [
                        subscription.start_date,
                        subscription.end_date,
                    ],
                },
                end_date: {
                    [Op.between]: [
                        subscription.start_date,
                        subscription.end_date,
                    ],
                },
                canceled_at: null,
            },
        });
        if (existsSubscription) {
            return response.status(422).json({
                error:
                    'This student already has a subscription for this plan in the same period',
            });
        }

        const createdSubscription = await Subscription.create(subscription, {
            include: [
                {
                    model: Plan,
                    as: 'plan',
                },
                {
                    model: Student,
                    as: 'student',
                },
            ],
        });

        await Queue.add(SubscriptionMail.key, {
            subscription: createdSubscription,
        });

        return response.json(createdSubscription);
    }
}

export default new SubscriptionController();
