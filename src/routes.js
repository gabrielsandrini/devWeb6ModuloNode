import { Router, json } from 'express';
import cors from 'cors';

import authMiddleware, { ensureIsAdmin } from './app/middlewares/auth';
import { addIsDoctorQueryFlag } from './app/middlewares/parsers';

import validateUserStore from './app/validators/UserStore';
import validateUserUpdate from './app/validators/UserUpdate';
import validateSessionStore from './app/validators/SessionStore';
import validateAppointmentStore from './app/validators/AppointmentStore';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import AvailableController from './app/controllers/AvailableController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import AppointmentReportController from './app/controllers/AppointmentReportController';

const routes = new Router();

routes.use(cors());
routes.use(json());

//Session
routes.post('/login', validateSessionStore, SessionController.store);

routes.use(authMiddleware);

routes.get('/user/:user_id', UserController.findOne);
routes.get('/doctors', addIsDoctorQueryFlag, UserController.index);
routes.get('/schedule/:doctor_id?', ScheduleController.index);
routes.get('/appointments', AppointmentController.index);
routes.get('/appointments/report', AppointmentReportController.handle);

routes.use(ensureIsAdmin);

//Users
routes.get('/users', UserController.index);
routes.post('/users', /* validateUserStore ,*/ UserController.store);
routes.put('/users/:user_id', UserController.update);
routes.delete('/users/:user_id', UserController.delete);

//Doctors
routes.get('/doctors/:doctor_id/available', AvailableController.index);

routes.post(
  '/appointments',
  validateAppointmentStore,
  AppointmentController.store
);

routes.delete('/appointments/:appointment_id', AppointmentController.delete);

export default routes;
