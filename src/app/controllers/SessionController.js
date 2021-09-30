import jwt from 'jsonwebtoken';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, is_admin, is_doctor } = user;
    return res.json({
      user: {
        id,
        name,
        email,
        is_admin,
        is_doctor,
      },
      token: jwt.sign({ id, is_admin, is_doctor }, authConfig.secret, {
        expiresIn: authConfig.expires,
      }),
    });
  }
}
export default new SessionController();
