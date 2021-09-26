import Appointment from '../models/Appointment';
import User from '../models/User';

import CreateAppointmentService from '../services/CreateAppointmentService';
import CancelAppointmentService from '../services/CancelAppointmentService';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date', 'past', 'cancelable'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'doctor',
          attributes: ['id', 'name'],
        },
      ],
    });

    return res.json(appointments);
  }

  async store(req, res) {
    const { doctor_id, date } = req.body;

    const appointment = await CreateAppointmentService.run({
      doctor_id,
      user_id: req.userId,
      date,
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await CancelAppointmentService.run({
      doctor_id: req.params.id,
      user_id: req.userId,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
