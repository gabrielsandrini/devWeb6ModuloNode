import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';
import AppError from '../errors/AppError';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token not provided');
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.user.id = decoded.id;
    req.is_doctor = decoded.is_doctor;
    req.is_admin = decoded.is_admin;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};

export const ensureIsAdmin = (req, _res, next) => {
  if (req.user.is_admin) {
    return next();
  }

  throw new AppError('Permission denied');
};
