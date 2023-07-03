import dotenv from 'dotenv';
import fs from 'fs';
import mongoose from 'mongoose';
import Tour from '../../models/toursModel.js';
import User from '../../models/userModel.js';
import Review from '../../models/reviewModel.js';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

const DB = process.env.DB_CONNECTION.replace('<PASSWORD>', process.env.DB_PASS);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect(DB).then(() => {
	console.log('DB connected successful!');
});

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
// const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
// const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

const importData = async () => {
	try {
		await Tour.create(tours);
		// await User.create(users, { validateBeforeSave: false });
		// await Review.create(reviews);
		console.log('Data imported successfuly');
		process.exit();
	} catch (err) {
		console.log(err);
	}
};

const deleteData = async () => {
	try {
		await Tour.deleteMany();
		// await User.deleteMany();
		// await Review.deleteMany();
		console.log('Data deleted successfuly');
		process.exit();
	} catch (err) {
		console.log(err);
	}
};

if (process.argv[2] === '--import') importData();
else if (process.argv[2] === '--delete') deleteData();
