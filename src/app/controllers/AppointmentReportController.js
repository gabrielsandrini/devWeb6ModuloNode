import { Op } from 'sequelize';
import Appointment from '../models/Appointment';
import User from '../models/User';
import { startOfDay, endOfDay, parseISO, addDays } from 'date-fns';
import ReportMail from '../jobs/ReportMail';

class AppointmentReportController {
  async handle(req, res) {
    const date = req?.query?.date
      ? parseISO(req.query.date)
      : addDays(new Date(), 1);

    console.log('DATA', date);

    const sendMail = async ({ doctor }) => {
      const appointments = await Appointment.findAll({
        where: {
          canceled_at: null,
          doctor_id: doctor.id,
          date: {
            [Op.lt]: endOfDay(date),
            [Op.gt]: startOfDay(date),
          },
        },
        order: ['date'],
        attributes: ['id', 'date', 'past', 'cancelable'],
        include: [
          {
            model: User,
            as: 'doctor',
            attributes: ['id', 'name'],
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name'],
          },
        ],
      });

      console.log('PARAMS', doctor.id, date, appointments.length);

      await ReportMail.handle({
        doctor,
        appointments: appointments.map((i) => i.dataValues),
        date,
      });

      return;
    };
    const doctors = (
      await User.findAll({ where: { id: 3, is_doctor: true } })
    ).map((d) => d.dataValues);

    await Promise.all(doctors.map((doctor) => sendMail({ doctor })));

    return res?.json({ ok: true });
  }
}

export default new AppointmentReportController();
