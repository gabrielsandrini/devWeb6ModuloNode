import 'dotenv/config';

import express from 'express';
import cors from 'cors';

import 'express-async-errors';

import AppError from './app/errors/AppError';
import routes from './routes';

import './app/jobs/CronJob';

import './database';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use((err, request, response, _nextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      code: err.statusCode,
    });
  }

  console.error(err);

  return response
    .status(500)
    .json({ status: 'error', message: 'Internal server error' });
});

export default app;
