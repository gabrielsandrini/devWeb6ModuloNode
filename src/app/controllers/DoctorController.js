import User from '../models/User';

class DoctorController {
  async index(req, res) {
    const doctors = await User.findAll({
      where: { is_doctor: true },
      attributes: ['id', 'name', 'email'],
    });

    return res.json(doctors);
  }
}

export default new DoctorController();
