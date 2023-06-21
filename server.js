import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';
dotenv.config();

const port = process.env.port || 3000;

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
