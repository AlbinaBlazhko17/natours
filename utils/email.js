import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD,
		},
	});

	const mailOptions = {
		from: 'Albina Blazhko <hello@natours.com>',
		to: options.email,
		subject: options.email,
		text: options.message,
	};

	await transporter.sendMail(mailOptions);
};

export default sendEmail;
