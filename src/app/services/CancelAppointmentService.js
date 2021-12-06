import { isBefore, subHours } from 'date-fns';
import AppError from '../errors/AppError';

import Appointment from '../models/Appointment';
import CancellationMail from '../jobs/CancellationMail';
import User from '../models/User';

class CancelAppointmentService {
  async run({ appointment_id }) {
    const appointment = await Appointment.findByPk(appointment_id);

    if (!appointment) {
      throw new AppError('Agendamento não encontrado.');
    }

    const dateWithSub = subHours(appointment.date, 2);
    if (isBefore(dateWithSub, new Date())) {
      throw new AppError(
        'Você só pode cancelar agendamentos com 2 horas de antecedência.'
      );
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    const user = await User.findOne({
      where: { id: appointment.user_id },
    });

    const doctor = await User.findOne({
      where: { id: appointment.doctor_id },
    });

    await CancellationMail.handle({
      data: {
        appointment: appointment.dataValues,
        user,
        doctor,
      },
    });

    return appointment;
  }
}

export default new CancelAppointmentService();
