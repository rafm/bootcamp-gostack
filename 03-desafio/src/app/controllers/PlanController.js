import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
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

        const plans = await Plan.findAll({
            where: { canceled_at: null },
            offset: (page - 1) * 20,
            limit: 20,
        });

        return response.json(plans);
    }

    async find(request, response) {
        const plan = await Plan.findByPk(request.params.id);

        if (!plan) {
            return response.status(404).json({ error: 'Plan does not exist' });
        }

        return response.json(plan);
    }

    async store(request, response) {
        const schema = Yup.object()
            .noUnknown() // TODO does not work
            .shape({
                title: Yup.string().required(),
                duration: Yup.number()
                    .integer()
                    .required()
                    .min(1),
                price: Yup.number()
                    .required()
                    .min(1)
                    .max(9999),
            });

        if (!schema.isValidSync(request.body)) {
            return response.status(400).json({ error: 'Validation fails' });
        }

        const plan = await Plan.create(request.body);

        return response.json(plan);
    }

    async update(request, response) {
        // TODO validate: at least one value / not empty
        const schema = Yup.object()
            .noUnknown() // TODO does not work
            .shape({
                title: Yup.string(),
                duration: Yup.number()
                    .integer()
                    .min(1),
                price: Yup.number()
                    .min(1)
                    .max(9999),
            });

        if (!schema.isValidSync(request.body)) {
            return response.status(400).json({ error: 'Validation fails' });
        }

        const plan = await Plan.findByPk(request.params.id);

        if (!plan) {
            return response.status(404).json({ error: 'Plan does not exist' });
        }

        const updatedPlan = await plan.update(request.body);

        return response.json(updatedPlan);
    }

    async delete(request, response) {
        const plan = await Plan.findByPk(request.params.id);

        if (!plan) {
            return response.status(404).json({ error: 'Plan does not exist' });
        }

        if (!plan.canceled_at) {
            plan.canceled_at = new Date();
            await plan.save();
        }

        return response.json(plan);
    }
}

export default new PlanController();
