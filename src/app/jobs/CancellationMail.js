import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMail {
  async handle({ data }) {
    const { appointment, user, doctor } = data;

    const requests = [];

    if (doctor) {
      requests.push(
        Mail.sendMail({
          to: `${doctor.name} <${doctor.email}>`,
          subject: 'Agendamento cancelado',
          template: 'cancellation',
          context: {
            receiver_name: doctor?.name,
            doctor_name: doctor?.name,
            user_name: user?.name ?? '',
            date: format(
              new Date(appointment.date),
              "'dia' dd 'de' MMMM', às' H:mm'h'",
              {
                locale: pt,
              }
            ),
          },
        })
      );
    }

    if (user) {
      requests.push(
        Mail.sendMail({
          to: `${user.name} <${user.email}>`,
          subject: 'Agendamento cancelado',
          template: 'cancellation',
          context: {
            receiver_name: user?.name,
            doctor_name: doctor?.name ?? '',
            user: user?.name ?? '',
            date: format(
              new Date(appointment.date),
              "'dia' dd 'de' MMMM', às' H:mm'h'",
              {
                locale: pt,
              }
            ),
          },
        })
      );
    }

    await Promise.all(requests);
  }
}

export default new CancellationMail();
