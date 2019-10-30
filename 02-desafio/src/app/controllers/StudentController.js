import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
    async store(request, response) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string()
                .required()
                .email(),
            age: Yup.number()
                .integer()
                .min(2)
                .max(150),
            weight: Yup.number()
                .min(1)
                .max(999),
            height: Yup.number()
                .integer()
                .min(10)
                .max(350),
        });

        if (!(await schema.isValid(request.body))) {
            return response.status(400).json({ error: 'Validation fails' });
        }

        const studentExists = await Student.findOne({
            where: { email: request.body.email },
        });
        if (studentExists) {
            return response
                .status(400)
                .json({ error: 'Student already exists' });
        }

        const { id, name, email, age, weight, height } = await Student.create(
            request.body
        );
        return response.json({ id, name, email, age, weight, height });
    }

    async update(request, response) {
        return response.send(`Student PUT, userId: ${request.userId}`);
    }
}

export default new StudentController();
