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

  async findOne(req, res) {
    const { user_id: user_url_id } = req.params;

    const user_id = req.user.is_admin ? user_url_id : req.user.id;

    const user = await User.findOne({
      where: { id: user_id },
    });

    user.password_hash = '';
    delete user.password_hash;

    return res.json(user);
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

    const { id, name, is_doctor, is_admin } = await User.findByPk(user_id);
    return res.json({
      id,
      name,
      email,
      is_doctor,
      is_admin,
    });
  }

  async delete(req, res) {
    const { user_id } = req.params;

    const user = await User.findByPk(user_id);

    if (!userExists) {
      return res.status(400).json({ error: 'User does not exists' });
    }

    await user.destroy({ where: { id: user_id } });

    return res.json({
      id: user_id,
    });
  }
}

export default new UserController();
