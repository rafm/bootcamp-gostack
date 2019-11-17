import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class AnswerMail {
    get key() {
        return 'AnswerMail';
    }

    async handle({ data: { helpOrder, student } }) {
        await Mail.sendMail({
            to: `${student.name} <${student.email}>`,
            subject: 'Pedido de auxílio respondido',
            template: 'answer',
            context: {
                name: student.name,
                question: helpOrder.question,
                created_at: format(
                    parseISO(helpOrder.createdAt),
                    "'Às 'HH:mm' do dia 'dd' de 'MMMM' de 'yyyy",
                    {
                        locale: pt,
                    }
                ),
                answer: helpOrder.answer,
                answer_at: format(
                    parseISO(helpOrder.answer_at),
                    "'Às 'HH:mm' do dia 'dd' de 'MMMM' de 'yyyy",
                    {
                        locale: pt,
                    }
                ),
            },
        });
    }
}

export default new AnswerMail();
