import * as Yup from 'yup';
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
        const checkIsProvider = await User.findOne({
            where: { id: provider_id, provider: true },
        });

        if (!checkIsProvider) {
            return response.status(401).json({
                error: 'You can only create appointments with providers',
            });
        }

        const appointment = await Appointment.create({
            date,
            user_id: request.userId,
            provider_id,
        });

        return response.json(appointment);
    }
}

export default new AppointmentController();
