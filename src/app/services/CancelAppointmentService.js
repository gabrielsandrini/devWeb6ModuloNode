import { isBefore, subHours } from 'date-fns';
import AppError from '../errors/AppError';

import Appointment from '../models/Appointment';
import User from '../models/User';

class CancelAppointmentService {
  async run({ doctor_id, user_id }) {
    const appointment = await Appointment.findByPk(doctor_id, {
      include: [
        {
          model: User,
          as: 'doctor',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    if (!appointment) {
      throw new AppError('Appointment not found');
    }

    if (appointment.user_id !== user_id) {
      throw new AppError(
        "You don't have permission to cancel this appointment"
      );
    }

    const dateWithSub = subHours(appointment.date, 2);
    if (isBefore(dateWithSub, new Date())) {
      throw new AppError('You can only cancel appointments 2 hours in advance');
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    return appointment;
  }
}

export default new CancelAppointmentService();
