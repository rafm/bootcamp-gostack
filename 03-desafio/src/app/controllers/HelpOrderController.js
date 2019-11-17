import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class HelpOrderController {
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
        const { id } = request.params;

        const student = await Student.findByPk(id);
        if (!student) {
            return response
                .status(404)
                .json({ error: 'Student does not exist' });
        }

        const helpOrders = await HelpOrder.findAll({
            where: { student_id: id },
            offset: (page - 1) * 20,
            limit: 20,
        });

        return response.json(helpOrders);
    }

    async store(request, response) {
        const schema = Yup.object().shape({
            question: Yup.string()
                .required()
                .trim()
                .min(5),
        });

        if (!schema.isValidSync(request.body)) {
            return response.status(400).json({ error: 'Validation fails' });
        }

        const { question } = schema.cast(request.body);
        const { id } = request.params;

        const student = await Student.findByPk(id);
        if (!student) {
            return response
                .status(404)
                .json({ error: 'Student does not exist' });
        }

        const helpOrder = await HelpOrder.create({
            student_id: id,
            question,
        });

        return response.json(helpOrder);
    }
}

export default new HelpOrderController();
