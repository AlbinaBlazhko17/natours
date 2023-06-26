import express from 'express';
import {
	signUp,
	login,
	forgotPassword,
	resetPassword,
	protect,
	updatePassword,
} from '../controller/authController.js';
import { getAllUsers } from '../controller/userController.js';

const userRouter = express.Router();

userRouter.post('/signup', signUp);
userRouter.post('/login', login);

userRouter.post('/forgotPassword', forgotPassword);

userRouter.patch('/resetPassword/:token', resetPassword);
userRouter.patch('/updateMyPassword', protect, updatePassword);
userRouter.route('/').get(getAllUsers);

export default userRouter;
