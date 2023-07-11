import express from 'express';
import {
	getOverview,
	getTour,
	getLoginForm,
	getRegisterForm,
	getAccount,
	updateUserData,
	getForgotPassword,
} from '../controller/viewsController.js';
import { isLoggedIn, protect } from '../controller/authController.js';

const viewRouter = express.Router();

viewRouter.use(isLoggedIn);

viewRouter.get('/', isLoggedIn, getOverview);
viewRouter.get('/tour/:slug', isLoggedIn, getTour);
viewRouter.get('/login', isLoggedIn, getLoginForm);
viewRouter.get('/register', isLoggedIn, getRegisterForm);
viewRouter.get('/forgotPassword', getForgotPassword);
viewRouter.get('/me', protect, getAccount);
viewRouter.post('/submit-user-data', protect, updateUserData);

export default viewRouter;
