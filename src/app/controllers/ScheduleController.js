import { parseISO, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';
import User from '../models/User';

class ScheduleController {
  async index(req, res) {
    const checkUserDoctor = await User.findOne({
      where: { id: req.userId, doctor_id: true },
    });

    if (!checkUserDoctor) {
      return res.status(401).json({ error: 'User is not a doctor' });
    }
    const { date } = req.query;
    const parsedDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        doctor_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
      order: ['date'],
    });

    return res.json(appointments);
  }
}

export default new ScheduleController();
