import { Op } from 'sequelize';
import {
    startOfDay,
    endOfDay,
    format,
    setHours,
    setMinutes,
    setSeconds,
    isAfter,
} from 'date-fns';
import Appointment from '../models/Appointment';

class AvailableController {
    async index(request, response) {
        const { date } = request.query;

        if (!date) {
            return response.status(400).json({ error: 'Invalid date' });
        }

        const searchDate = Number(date);

        const appointments = await Appointment.findAll({
            where: {
                provider_id: request.params.providerId,
                canceled_at: null,
                date: {
                    [Op.between]: [
                        startOfDay(searchDate),
                        endOfDay(searchDate),
                    ],
                },
            },
        });

        const schedule = [
            '08:00',
            '09:00',
            '10:00',
            '11:00',
            '12:00',
            '13:00',
            '14:00',
            '15:00',
            '16:00',
            '17:00',
            '18:00',
            '19:00',
        ];
        const availableAppointmentDates = schedule.map(time => {
            const [hours, minutes] = time.split(':');
            const value = setHours(
                setMinutes(setSeconds(searchDate, 0), minutes),
                hours
            );
            return {
                time,
                value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
                available:
                    isAfter(value, new Date()) &&
                    !appointments.find(a => format(a.date, 'HH:mm') === time),
            };
        });

        return response.json(availableAppointmentDates);
    }
}

export default new AvailableController();
