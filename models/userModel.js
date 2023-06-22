import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail.js';
import isStrongPassword from 'validator/lib/isStrongPassword.js';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'User must have a name'],
	},
	email: {
		type: String,
		required: [true, 'User must have an email'],
		lowercase: true,
		validate: [isEmail, 'Incorrect email'],
		unique: true,
	},
	photo: String,
	password: {
		type: String,
		required: [true, 'User must have a password'],
		validate: [isStrongPassword, 'Password must be stronger'],
		select: false,
	},
	passwordConfirm: {
		type: String,
		required: [true, 'Please confirm your password'],
		validate: {
			validator: function (el) {
				return el === this.password;
			},
			message: 'Password aare not the same',
		},
	},
	passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	this.password = await bcrypt.hash(this.password, 12);

	this.passwordConfirm = undefined;
	next();
});

userSchema.methods.correctPassword = function (candidatePassword, userPassword) {
	return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
		return JWTTimestamp < changedTimestamp;
	}
	return false;
};

const User = mongoose.model('User', userSchema);

export default User;
