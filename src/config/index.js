require('dotenv').config();
const { env } = process;

module.exports = {
	PORT: parseInt(env.PORT, 10) || 3000,
	POSTGRES_CONNECTION_STRING: String(env.POSTGRES_CONNECTION_STRING),
};
