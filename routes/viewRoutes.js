import express from 'express';
import {
	getOverview,
	getTour,
	getLoginForm,
	getRegisterForm,
} from '../controller/viewsController.js';
import { isLoggedIn } from '../controller/authController.js';

const viewRouter = express.Router();

viewRouter.use(isLoggedIn);
viewRouter.get('/', getOverview);
viewRouter.get('/tour/:slug', getTour);
viewRouter.get('/login', getLoginForm);
viewRouter.get('/register', getRegisterForm);

export default viewRouter;
