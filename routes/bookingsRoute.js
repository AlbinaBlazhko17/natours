import express from 'express';
import { getCheckoutSession } from '../controller/bookingController.js';
import { protect } from '../controller/authController.js';

const bookingRouter = express.Router();

bookingRouter.get('/checkout-session/:tourId', protect, getCheckoutSession);

export default bookingRouter;
