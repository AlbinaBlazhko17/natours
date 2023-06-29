import express from 'express';
import {
	signUp,
	login,
	forgotPassword,
	resetPassword,
	protect,
	updatePassword,
	restrictTo,
} from '../controller/authController.js';
import { deleteMe, deleteUser, getAllUsers, updateMe } from '../controller/userController.js';

const userRouter = express.Router();

userRouter.route('/').get(getAllUsers);

userRouter.post('/signup', signUp);
userRouter.post('/login', login);
userRouter.route('/:id', protect, restrictTo('admin'), deleteUser);

userRouter.post('/forgotPassword', forgotPassword);

userRouter.patch('/resetPassword/:token', resetPassword);
userRouter.patch('/updateMyPassword', protect, updatePassword);
userRouter.patch('/updateMe', protect, updateMe);
userRouter.delete('/deleteMe', protect, deleteMe);

export default userRouter;
