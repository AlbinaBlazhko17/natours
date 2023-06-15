import app from './app.js';
import { process } from 'dotenv';

const port = process.env.port || 3000;

app.listen(port, () => {
	console.log(`App running on port ${port}`);
});
