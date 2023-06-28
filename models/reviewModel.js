import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
	{
		review: {
			type: String,
			required: [true, 'Review can not be empty'],
			minLength: [10, 'Review must have more or equal then 10 characters'],
			maxLength: [200, 'Review must have less or more then 200 characters'],
			unique: true,
		},
		rating: {
			type: Number,
			default: 4.5,
			min: [1, 'Rating must be above 1.0'],
			max: [5, 'Rating must be below 5.0'],
		},
		createdAt: {
			type: Date,
			default: Date.now(),
		},
		user: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
			required: [true, 'Review must belong to a user'],
		},
		tour: {
			type: mongoose.Types.ObjectId,
			ref: 'Tour',
			required: [true, 'Review must belong to a tour'],
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// reviewSchema.pre(/^find/, function (next) {
// 	this.populate({
// 		path: 'user',
// 		select: 'name photo',
// 	}).populate({
// 		path: 'tour',
// 		select: 'name',
// 	});
// 	next();
// });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
