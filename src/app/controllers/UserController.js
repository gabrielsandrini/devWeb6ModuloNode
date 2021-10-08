import User from '../models/User';

class UserController {
  async index(req, res) {
    const { is_admin, is_doctor } = req.query;

    const filters = {};
    if (typeof is_admin !== 'undefined' || is_admin !== null) {
      Object.assign(filters, { is_admin });
    }
    if (typeof is_doctor !== 'undefined' || is_doctor !== null) {
      Object.assign(filters, { is_doctor });
    }

    if (typeof is_admin == 'undefined'){
      Object.assign(filters, { is_admin : false});
    }
    if (typeof is_doctor == 'undefined'){
      Object.assign(filters, { is_doctor : false});
    }

    const users = await User.findAll({
      where: filters,
      attributes: ['id', 'name', 'email' ],
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

    const user = await User.create(req.body);

    user.password_hash = '';
    delete user.password_hash;

    return res.json(user);
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

    const userUpdated = await User.findByPk(user_id);

    user.password_hash = '';
    delete user.password_hash;

    return res.json(userUpdated);
  }

  async delete(req, res) {
    const { user_id } = req.params;

    const user = await User.findByPk(user_id);

    if (!user) {
      return res.status(400).json({ error: 'User does not exists' });
    }

    await user.destroy({ where: { id: user_id } });

    return res.json({
      id: user_id,
    });
  }
}

export default new UserController();
