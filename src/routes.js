import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import AvailableController from './app/controllers/AvailableController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';

import authMiddleware, { ensureIsAdmin } from './app/middlewares/auth';
import { addIsDoctorQueryFlag } from './app/middlewares/parsers';

const routes = new Router();

//Session
routes.post('/login', SessionController.store);

routes.use(authMiddleware);

routes.get('/doctors', addIsDoctorQueryFlag, UserController.index);
routes.get('/schedule/:doctor_id?', ScheduleController.index);
routes.get('/appointments/:user_id?', AppointmentController.index);

routes.use(ensureIsAdmin);

//Users
routes.get('/users', UserController.index);
routes.post('/users', UserController.store);
routes.put('/users/:user_id', UserController.update);

//Doctors
routes.get('/doctors/:doctor_id/available', AvailableController.index);

routes.post('/appointments', AppointmentController.store);

routes.delete('/appointments/:user_id', AppointmentController.delete);

export default routes;
