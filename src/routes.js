import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import DoctorController from './app/controllers/DoctorController';
import AvailableController from './app/controllers/AvailableController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

//Session
routes.post('/login', SessionController.store);

//Users
routes.post('/users', UserController.store);
routes.put('/users', authMiddleware, UserController.update);

//Doctors
routes.get('/doctors', DoctorController.index);
routes.get('/doctors/:doctor_id/available', AvailableController.index);

//Health check
routes.get('/health', (req, res) => res.json({ health: true }));

export default routes;
