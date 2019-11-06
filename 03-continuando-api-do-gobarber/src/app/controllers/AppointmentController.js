import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
import User from '../models/User';
import Appointment from '../models/Appointment';

class AppointmentController {
    async store(request, response) {
        const schema = Yup.object().shape({
            date: Yup.date().required(),
            provider_id: Yup.number()
                .integer()
                .required(),
        });

        if (!(await schema.isValid(request.body))) {
            return response.status(400).json({ error: 'Validation fails' });
        }

        const { date, provider_id } = request.body;

        /**
         * check if provider_id is a provider
         */
        const checkIsProvider = await User.findOne({
            where: { id: provider_id, provider: true },
        });
        if (!checkIsProvider) {
            return response.status(401).json({
                error: 'You can only create appointments with providers',
            });
        }

        /**
         * Check for past dates
         */
        const hourStart = startOfHour(parseISO(date));
        if (isBefore(hourStart, new Date())) {
            return response
                .status(400)
                .json({ error: 'Past dates are not permitted' });
        }

        /**
         * Check date availability
         */
        const checkAvailability = await Appointment.findOne({
            where: {
                date: hourStart,
                provider_id,
                canceled_at: null,
            },
        });
        if (checkAvailability) {
            return response
                .status(400)
                .json({ error: 'Appointment date is not available' });
        }

        const appointment = await Appointment.create({
            date: hourStart,
            user_id: request.userId,
            provider_id,
        });

        return response.json(appointment);
    }
}

export default new AppointmentController();
