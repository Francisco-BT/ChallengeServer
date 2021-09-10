const { env } = process;
const path = require('path');

require('dotenv').config({
	path: path.resolve(
		process.cwd(),
		`.env${env.NODE_ENV === 'production' ? '' : `.${env.NODE_ENV}`}`
	),
});

module.exports = {
	PORT: parseInt(env.PORT, 10) || 3000,
	POSTGRES_CONNECTION_STRING: String(env.POSTGRES_CONNECTION_STRING),
};
