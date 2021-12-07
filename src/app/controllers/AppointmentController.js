import Appointment from '../models/Appointment';
import User from '../models/User';

import CreateAppointmentService from '../services/CreateAppointmentService';
import CancelAppointmentService from '../services/CancelAppointmentService';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { canceled_at: null },
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
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
        },
      ],
    });

    return res.json(appointments);
  }

  async store(req, res) {
    const { user_id, doctor_id, date } = req.body;

    const appointment = await CreateAppointmentService.run({
      doctor_id,
      user_id,
      date,
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    const { appointment_id } = req.params;

    const appointment = await CancelAppointmentService.run({
      appointment_id,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
