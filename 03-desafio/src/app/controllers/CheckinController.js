import { Op } from 'sequelize';
import { subDays } from 'date-fns';
import Student from '../models/Student';
import Checkin from '../models/Checkin';

class CheckinController {
    async index(request, response) {
        const { id } = request.params;
        const student = await Student.findByPk(id);

        if (!student) {
            return response
                .status(404)
                .json({ error: 'Student does not exist' });
        }

        const checkins = await Checkin.findAll({ where: { student_id: id } });

        return response.json(checkins);
    }

    async store(request, response) {
        const { id } = request.params;

        const currentDate = new Date();
        const count = await Checkin.count({
            where: {
                student_id: id,
                created_at: {
                    [Op.between]: [subDays(currentDate, 7), currentDate],
                },
            },
        });
        if (count >= 5) {
            return response.status(422).json({
                error: 'Students can only do at most 5 checkins per week',
            });
        }

        const checkin = await Checkin.create({ student_id: id });

        return response.json(checkin);
    }
}

export default new CheckinController();
