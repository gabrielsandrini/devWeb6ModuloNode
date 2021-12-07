import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMail {
  async handle(data) {
    const { appointments, doctor, user, date } = data;

    console.log('appointments', appointments[0].user);

    await Mail.sendMail({
      to: `${doctor.name} <${doctor.email}>`,
      subject: 'Boletim diário',
      template: 'daily_report',
      context: {
        doctor_name: doctor?.name,
        appointments: appointments,
        date: format(new Date(date), "'dia' dd 'de' MMMM', às' H:mm'h'", {
          locale: pt,
        }),
      },
    });
  }
}

export default new CancellationMail();
