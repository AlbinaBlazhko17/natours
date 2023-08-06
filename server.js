import dotenv from 'dotenv';
import mongoose from 'mongoose';

process.on('uncaughtException', (err) => {
	console.log('UNCAUGHT EXCEPTION!💥 Shutting down...');
	console.log(err.name, err.message);
	process.exit(1);
});

import app from './app.js';
dotenv.config();

const port = process.env.PORT;

const DB = process.env.DB_CONNECTION.replace('<PASSWORD>', process.env.DB_PASS);

mongoose.connect(DB).then(() => {
	console.log('DB connected successful!');
});

const server = app.listen(port, () => {
	console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
	console.log('UNHANDLED REJECTION!💥 Shutting down...');
	console.log(err);
	server.close(() => {
		process.exit(1);
	});
});
