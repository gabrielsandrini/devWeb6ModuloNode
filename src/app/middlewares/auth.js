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

    req.user = {};
    req.user.id = decoded.id;
    req.user.is_doctor = decoded.is_doctor;
    req.user.is_admin = decoded.is_admin;

    return next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const ensureIsAdmin = (req, _res, next) => {
  if (req.user.is_admin) {
    return next();
  }

  throw new AppError('Permission denied');
};
