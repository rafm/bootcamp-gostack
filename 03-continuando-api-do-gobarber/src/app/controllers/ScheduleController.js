import { Op } from 'sequelize';
import { parseISO, startOfDay, endOfDay } from 'date-fns';
import User from '../models/User';
import Appointment from '../models/Appointment';

class ScheduleController {
    async index(request, response) {
        const checkUserProvider = await User.findOne({
            where: {
                id: request.userId,
                provider: true,
            },
        });
        if (!checkUserProvider) {
            return response
                .status(401)
                .json({ error: 'User is not a provider' });
        }

        const parsedDate = parseISO(request.query.date);
        const appointments = await Appointment.findAll({
            where: {
                provider_id: request.userId,
                canceled_at: null,
                date: {
                    [Op.between]: [
                        startOfDay(parsedDate),
                        endOfDay(parsedDate),
                    ],
                },
            },
            order: ['date'],
        });

        return response.json(appointments);
    }
}

export default new ScheduleController();
