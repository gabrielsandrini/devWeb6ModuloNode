import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CreateAppointmentMail {
  async handle({ data }) {
    const { appointment, user, doctor } = data;

    await Mail.sendMail({
      to: `${doctor.name} <${doctor.email}>`,
      subject: 'Agendamento criado',
      template: 'create_appointment',
      context: {
        receiver_name: doctor.name,
        user_name: user.name,
        doctor_name: doctor?.name ?? '',
        date: format(
          new Date(appointment.date),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });

    await Mail.sendMail({
      to: `${user.name} <${user.email}>`,
      subject: 'Agendamento criado',
      template: 'create_appointment',
      context: {
        receiver_name: user.name,
        user_name: user.name,
        doctor_name: doctor?.name ?? '',
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

export default new CreateAppointmentMail();
