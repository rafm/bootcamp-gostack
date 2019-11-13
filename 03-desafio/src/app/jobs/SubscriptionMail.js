import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class SubscriptionMail {
    get key() {
        return 'SubscriptionMail';
    }

    async handle({ data: { subscription } }) {
        await Mail.sendMail({
            to: `${subscription.student.name} <${subscription.student.email}>`,
            subject: 'Matrícula realizada',
            template: 'subscription',
            context: {
                name: subscription.student.name,
                plan: subscription.plan.title,
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
