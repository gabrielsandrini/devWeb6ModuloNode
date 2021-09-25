import User from '../models/User';

class UserController {
  async store(req, res) {
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    req.body.is_doctor = false;
    const { id, name, email, is_doctor } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      is_doctor,
    });
  }

  async update(req, res) {
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    delete req.body.is_doctor;

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

    const { id, name } = await User.findByPk(req.userId);
    return res.json({
      id,
      name,
      email,
    });
  }
}

export default new UserController();
