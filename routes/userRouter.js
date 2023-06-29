import express from 'express';
import {
	forgotPassword,
	login,
	protect,
	resetPassword,
	restrictTo,
	signUp,
	updatePassword,
} from '../controller/authController.js';
import {
	deleteMe,
	deleteUser,
	getAllUsers,
	getMe,
	getUser,
	updateMe,
	updateUser,
} from '../controller/userController.js';

const userRouter = express.Router();

userRouter.route('/').get(getAllUsers);

userRouter.post('/signup', signUp);
userRouter.post('/login', login);
userRouter
	.route('/:id')
	.delete(protect, restrictTo('admin'), deleteUser)
	.patch(protect, updateUser)
	.get(protect, getUser);

userRouter.post('/forgotPassword', forgotPassword);
userRouter.patch('/resetPassword/:token', resetPassword);
userRouter.patch('/updateMyPassword', protect, updatePassword);

userRouter.get('/me', protect, getMe);
userRouter.patch('/updateMe', protect, updateMe, getUser);
userRouter.delete('/deleteMe', protect, deleteMe);

export default userRouter;
