import nodemailer from 'nodemailer';
import pug from 'pug';
import { fileURLToPath } from 'url';
import path from 'path';
import { htmlToText } from 'html-to-text';

export const __dirname = path.dirname(fileURLToPath(import.meta.url));
class Email {
	constructor(user, url) {
		this.to = user.email;
		this.firstName = user.name.split(' ')[0];
		this.url = url;
		this.from = `Albina Blazhko <${process.env.EMAIL_FROM}>`;
	}

	createTransport() {
		if (process.env.NODE_ENV === 'production') {
			return 1;
		}

		return nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			auth: {
				user: process.env.EMAIL_USERNAME,
				pass: process.env.EMAIL_PASSWORD,
			},
		});
	}

	async send(template, subject) {
		const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
			firstName: this.firstName,
			url: this.url,
			subject,
		});

		const mailOptions = {
			from: this.from,
			to: this.to,
			subject,
			html,
			text: htmlToText(html),
		};

		await this.createTransport().sendMail(mailOptions);
	}

	async sendWelcome() {
		await this.send('welcome', 'Welcome to the Natours Family!');
	}
}

export default Email;
