import express from 'express';
import {
	getOverview,
	getTour,
	getLoginForm,
	getRegisterForm,
	getAccount,
	updateUserData,
	getForgotPassword,
	getResetPassword,
	getMyTours,
} from '../controller/viewsController.js';
import { isLoggedIn, protect, resetPassword } from '../controller/authController.js';
import { createBookingCheckout } from '../controller/bookingController.js';

const viewRouter = express.Router();

// viewRouter.use(isLoggedIn);

viewRouter.get('/', isLoggedIn, getOverview);
viewRouter.get('/tour/:slug', isLoggedIn, getTour);
viewRouter.get('/login', isLoggedIn, getLoginForm);
viewRouter.get('/register', isLoggedIn, getRegisterForm);
viewRouter.get('/forgotPassword', getForgotPassword);
viewRouter.get('/resetPassword/:token', getResetPassword);
viewRouter.get('/me', protect, getAccount);
viewRouter.get('/my-bookings', protect, getMyTours);
viewRouter.post('/submit-user-data', protect, updateUserData);

export default viewRouter;
