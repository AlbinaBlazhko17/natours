import express from 'express';
import { signUp, login, forgotPassword, resetPassword } from '../controller/authController.js';
import { getAllUsers } from '../controller/userController.js';

const userRouter = express.Router();

userRouter.post('/signup', signUp);
userRouter.post('/login', login);

userRouter.post('/forgot', forgotPassword);

userRouter.patch('/resetPassword/:token', resetPassword);

userRouter.route('/').get(getAllUsers);
// userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default userRouter;
