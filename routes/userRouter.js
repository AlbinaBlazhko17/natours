import express from 'express';
import { signUp } from '../controller/userController.js';

const userRouter = express.Router();

userRouter.post('/signup', signUp);

// userRouter.route('/').get(getAllUsers).post(createUser);
// userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default userRouter;
