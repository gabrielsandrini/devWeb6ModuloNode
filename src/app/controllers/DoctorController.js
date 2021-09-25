import User from '../models/User';

class DoctorController {
  async index(req, res) {
    const providers = await User.findAll({
      where: { is_doctor: true },
      attributes: ['id', 'name', 'email'],
    });

    return res.json(providers);
  }
}

export default new DoctorController();
