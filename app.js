import express from 'express';
import tourRouter from './routes/tourRouter.js';
import userRouter from './routes/userRouter.js';

const app = express();

app.use(express.json());
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

export default app;
