import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class SubscriptionMail {
    get key() {
        return 'SubscriptionMail';
    }

    async handle({ data: { subscription, plan, student } }) {
        await Mail.sendMail({
            to: `${student.name} <${student.email}>`,
            subject: 'Matrícula realizada',
            template: 'subscription',
            context: {
                name: student.name,
                plan: plan.title,
                price: subscription.price,
                start_date: format(
                    parseISO(subscription.start_date),
                    "dd' de 'MMMM' de 'yyyy",
                    {
                        locale: pt,
                    }
                ),
                end_date: format(
                    parseISO(subscription.end_date),
                    "dd' de 'MMMM' de 'yyyy",
                    {
                        locale: pt,
                    }
                ),
            },
        });
    }
}

export default new SubscriptionMail();
