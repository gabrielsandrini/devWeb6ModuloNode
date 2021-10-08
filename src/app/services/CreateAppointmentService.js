import { startOfHour, parseISO, isBefore } from 'date-fns';

import User from '../models/User';
import Appointment from '../models/Appointment';
import AppError from '../errors/AppError';

class CreateAppointmentService {
  async run({ doctor_id, user_id, date }) {
    if (doctor_id === user_id) {
      throw new AppError(
        "You can't create appointments in which the user is the doctor"
      );
    }

    /*
     Check if doctor_id is a doctor
    */

    const isDoctor = await User.findOne({
      where: { id: doctor_id, is_doctor: true },
    });

    if (!isDoctor) {
      throw new AppError('You can only create appointments with doctors');
    }

    /*
      Check for past dates
    */
    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      throw new AppError('Você não pode cadastrar com uma data anterior a hoje.');
    }

    /*
      Check avaliability
    */
    const checkAvaliability = await Appointment.findOne({
      where: { doctor_id, canceled_at: null, date: hourStart },
    });

    if (checkAvaliability) {
      throw new AppError('Data escolhida não está disponível.');
    }

    const appointment = await Appointment.create({
      user_id,
      doctor_id,
      date: hourStart,
    });

    return appointment;
  }
}

export default new CreateAppointmentService();
