import User from '../models/User';

class UserController {
  async index(req, res) {
    const { is_admin, is_doctor } = req.query;

    const filters = {};
    if (is_admin) {
      Object.assign(filters, { is_admin: true });
    }
    if (is_doctor) {
      Object.assign(filters, { is_doctor: true });
    }

    const users = await User.findAll({
      where: filters,
      attributes: ['id', 'name', 'email'],
    });

    return res.json(users);
  }

  async store(req, res) {
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id, name, email, is_doctor, is_admin } = await User.create(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      is_doctor,
      is_admin,
    });
  }

  async update(req, res) {
    const { user_id } = req.params;
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(user_id);

    if (email !== user.email) {
      const userExists = await User.findOne({
        where: { email: req.body.email },
      });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    await user.update(req.body);

    const { id, name, is_doctor, is_admin } = await User.findByPk(req.userId);
    return res.json({
      id,
      name,
      email,
      is_doctor,
      is_admin,
    });
  }
}

export default new UserController();
