import { startOfHour, parseISO, isBefore } from 'date-fns';

import User from '../models/User';
import Appointment from '../models/Appointment';
import AppError from '../errors/AppError';
import CreateAppointmentMail from '../jobs/CreateAppointmentMail';

class CreateAppointmentService {
  async run({ doctor_id, user_id, date }) {
    if (doctor_id === user_id) {
      throw new AppError(
        "You can't create appointments in which the user is the doctor"
      );
    }

    const user = await User.findOne({
      where: { id: user_id },
    });

    if (!user) {
      throw new AppError('User does not exists');
    }

    /*
     Check if doctor_id is a doctor
    */

    const doctor = await User.findOne({
      where: { id: doctor_id, is_doctor: true },
    });

    if (!doctor) {
      throw new AppError('You can only create appointments with doctors');
    }

    /*
      Check for past dates
    */
    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      throw new AppError(
        'Você não pode cadastrar com uma data anterior a hoje.'
      );
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

    await CreateAppointmentMail.handle({
      data: {
        appointment: appointment.dataValues,
        user,
        doctor,
      },
    });

    return appointment;
  }
}

export default new CreateAppointmentService();
