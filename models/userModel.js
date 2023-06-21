import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import isStrongPassword from 'validator/lib/isStrongPassword';

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'User must have a name'],
	},
	email: {
		type: String,
		required: [true, 'User must have an email'],
		lowercase: true,
		validate: [isEmail(val), 'Incorrect email'],
	},
	photo: String,
	password: {
		type: String,
		required: [true, 'User must have a password'],
		validate: [isStrongPassword(val), 'Password must be stronger'],
	},
	passwordConfirm: {
		type: String,
		required: [true, 'Please confirm your password'],
	},
});

const User = mongoose.model('User', userSchema);

export default User;
