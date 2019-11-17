import * as Yup from 'yup';
import { startOfDay, endOfDay, addMonths, isEqual } from 'date-fns';
import { Op } from 'sequelize';
import Subscription from '../models/Subscription';
import Student from '../models/Student';
import Plan from '../models/Plan';
import Queue from '../../lib/Queue';
import SubscriptionMail from '../jobs/SubscriptionMail';

class SubscriptionController {
    async index(request, response) {
        const schema = Yup.object().shape({
            page: Yup.number()
                .integer()
                .min(1)
                .default(1),
        });

        if (!schema.isValidSync(request.query)) {
            return response.status(400).json({ error: 'Validation fails' });
        }

        const { page } = schema.cast(request.query);

        const subscriptions = await Subscription.findAll({
            where: { canceled_at: null },
            offset: (page - 1) * 20,
            limit: 20,
        });

        return response.json(subscriptions);
    }

    async find(request, response) {
        const subscription = await Subscription.findByPk(request.params.id);

        if (!subscription) {
            return response
                .status(404)
                .json({ error: 'Subscription does not exist' });
        }

        return response.json(subscription);
    }

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

        if (!schema.isValidSync(request.body)) {
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
        const existsSubscription = await Subscription.findOne({
            where: {
                student_id: subscription.student_id,
                plan_id: subscription.plan_id,
                [Op.or]: [
                    {
                        start_date: {
                            [Op.between]: [
                                subscription.start_date,
                                subscription.end_date,
                            ],
                        },
                    },
                    {
                        end_date: {
                            [Op.between]: [
                                subscription.start_date,
                                subscription.end_date,
                            ],
                        },
                    },
                ],
                canceled_at: null,
            },
        });
        if (existsSubscription) {
            return response.status(422).json({
                error:
                    'This student already has a subscription for this plan in the same period',
            });
        }

        const createdSubscription = await Subscription.create(subscription);

        await Queue.add(SubscriptionMail.key, {
            subscription: createdSubscription,
            plan,
            student,
        });

        return response.json(createdSubscription);
    }

    async update(request, response) {
        // TODO validate: at least one value / not empty
        const schema = Yup.object()
            .noUnknown() // TODO does not work
            .shape({
                student_id: Yup.number().integer(),
                plan_id: Yup.number().integer(),
                start_date: Yup.date().min(startOfDay(new Date())),
            });

        if (!schema.isValidSync(request.body)) {
            return response.status(400).json({ error: 'Validation fails' });
        }

        const subscription = await Subscription.findByPk(request.params.id);

        if (!subscription) {
            return response
                .status(404)
                .json({ error: 'Subscription does not exist' });
        }

        const changesToSubscription = schema.cast(request.body);

        if (changesToSubscription.student_id) {
            if (changesToSubscription.student_id === subscription.student_id) {
                delete changesToSubscription.student_id;
            } else {
                const student = await Student.findByPk(
                    changesToSubscription.student_id
                );
                if (!student) {
                    return response
                        .status(404)
                        .json({ error: 'Student was not found' });
                }
            }
        }

        let plan;
        if (changesToSubscription.plan_id) {
            if (changesToSubscription.plan_id === subscription.plan_id) {
                delete changesToSubscription.plan_id;
            } else {
                plan = await Plan.findByPk(changesToSubscription.plan_id);
                if (!plan) {
                    return response
                        .status(404)
                        .json({ error: 'Plan was not found' });
                }
                /**
                 * Calculating subscription price
                 */
                changesToSubscription.price = plan.price * plan.duration;
            }
        }

        if (changesToSubscription.start_date) {
            /**
             *  Normalizing start_date
             */
            changesToSubscription.start_date = startOfDay(
                changesToSubscription.start_date
            );
            if (
                isEqual(
                    changesToSubscription.start_date,
                    subscription.start_date
                )
            ) {
                delete changesToSubscription.start_date;
            } else {
                if (!plan) {
                    plan = await Plan.findByPk(subscription.plan_id);
                }
                /**
                 * Calculating and normalizing subscription end_date
                 */
                changesToSubscription.end_date = endOfDay(
                    addMonths(changesToSubscription.start_date, plan.duration)
                );
            }
        }

        /**
         * Check if all the changes are equals to the original values
         */
        if (
            !changesToSubscription.student_id &&
            !changesToSubscription.plan_id &&
            !changesToSubscription.start_date
        ) {
            return response.json(subscription);
        }

        /**
         * Checking if the user already has a subscription for the specified plan in the same period of time
         */
        const existsSubscription = await Subscription.findOne({
            where: {
                id: {
                    [Op.ne]: request.params.id,
                },
                student_id:
                    changesToSubscription.student_id || subscription.student_id,
                plan_id: changesToSubscription.plan_id || subscription.plan_id,
                [Op.or]: [
                    {
                        start_date: {
                            [Op.between]: [
                                changesToSubscription.start_date ||
                                    subscription.start_date,
                                changesToSubscription.end_date ||
                                    subscription.end_date,
                            ],
                        },
                    },
                    {
                        end_date: {
                            [Op.between]: [
                                changesToSubscription.start_date ||
                                    subscription.start_date,
                                changesToSubscription.end_date ||
                                    subscription.end_date,
                            ],
                        },
                    },
                ],
                canceled_at: null,
            },
        });
        if (existsSubscription) {
            return response.status(422).json({
                error:
                    'This student already has a subscription for this plan in the same period',
            });
        }

        const updatedSubscription = await subscription.update(
            changesToSubscription
        );

        return response.json(updatedSubscription);
    }

    async delete(request, response) {
        const subscription = await Subscription.findByPk(request.params.id);

        if (!subscription) {
            return response
                .status(404)
                .json({ error: 'Subscription does not exist' });
        }

        if (!subscription.canceled_at) {
            subscription.canceled_at = new Date();
            await subscription.save();
        }

        return response.json(subscription);
    }
}

export default new SubscriptionController();
