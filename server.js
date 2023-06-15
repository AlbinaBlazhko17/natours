import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import app from './app.js';

// eslint-disable-next-line no-undef
const port = process.env.port || 3000;
// eslint-disable-next-line no-undef
const DB = process.env.DB_CONNECTION.replace('<PASSWORD>', process.env.DB_PASS);

mongoose.connect(DB).then(() => {
	console.log('DB connected successful!');
});

app.listen(port, () => {
	console.log(`App running on port ${port}`);
});
