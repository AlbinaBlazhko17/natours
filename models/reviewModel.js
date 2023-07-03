import mongoose from 'mongoose';
import Tour from './toursModel.js';

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

reviewSchema.statics.calcAverageRatings = async function (tour) {
	const rating = await this.aggregate([
		{
			$match: { tour: tourId },
		},
		{
			$group: {
				_id: '$tour',
				nRating: { $sum: 1 },
				avgRating: { $avg: '$rating' },
			},
		},
	]);
	if (rating.length > 0) {
		await Tour.findByIdAndUpdate(tourId, {
			ratingsQuantity: rating[0].nRating,
			ratingsAverage: rating[0].avgRating,
		});
	} else {
		await Tour.findByIdAndUpdate(tourId, {
			ratingsQuantity: 0,
			ratingsAverage: 4.5,
		});
	}
};

reviewSchema.post('save', function () {
	this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
	this.r = await this.findOne();
	next();
});

reviewSchema.post(/^findOneAnd/, async function () {
	await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
