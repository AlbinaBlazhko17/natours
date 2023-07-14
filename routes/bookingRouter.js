import express from 'express';
import {
	getCheckoutSession,
	getAllBookings,
	createBooking,
	getBooking,
	updateBooking,
	deleteBooking,
} from '../controller/bookingController.js';
import { protect, restrictTo } from '../controller/authController.js';

const bookingRouter = express.Router();

bookingRouter.use(protect);

bookingRouter.get('/checkout-session/:tourId', protect, getCheckoutSession);

bookingRouter.use(restrictTo('admin', 'lead-guide'));

bookingRouter.route('/').get(getAllBookings).post(createBooking);

bookingRouter.route('/:id').get(getBooking).patch(updateBooking).delete(deleteBooking);

export default bookingRouter;
