import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMail {
  async handle({ data }) {
    const { appointment, user, doctor } = data;

    console.log('APPOINTMENT', appointment);
    console.log(appointment.date);
    await Mail.sendMail({
      to: `${doctor.name} <${doctor.email}>`,
      subject: 'Agendamento cancelado',
      template: 'cancellation',
      context: {
        provider: doctor.name,
        user: user.name,
        date: format(
          new Date(appointment.date),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new CancellationMail();
