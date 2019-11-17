import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Queue from '../../lib/Queue';
import AnswerMail from '../jobs/AnswerMail';
import Student from '../models/Student';

class AnswerController {
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

        const helpOrders = await HelpOrder.findAll({
            where: { answer: null },
            offset: (page - 1) * 20,
            limit: 20,
        });

        return response.json(helpOrders);
    }

    async store(request, response) {
        const schema = Yup.object().shape({
            answer: Yup.string()
                .required()
                .trim()
                .min(5),
        });

        if (!schema.isValidSync(request.body)) {
            return response.status(400).json({ error: 'Validation fails' });
        }

        const { answer } = schema.cast(request.body);

        const helpOrder = await HelpOrder.findByPk(request.params.id);

        if (!helpOrder) {
            return response
                .status(404)
                .json({ error: 'Help order does not exist' });
        }

        if (helpOrder.answer) {
            return response
                .status(422)
                .json({ error: 'This help order is already answered' });
        }

        const answeredHelpOrder = await helpOrder.update({
            answer,
            answer_at: new Date(),
        });
        const student = await Student.findByPk(answeredHelpOrder.student_id);

        await Queue.add(AnswerMail.key, {
            helpOrder: answeredHelpOrder,
            student,
        });

        return response.json(answeredHelpOrder);
    }
}

export default new AnswerController();
