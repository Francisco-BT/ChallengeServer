const expressServer = require('./server');
const PORT = 3000;

const server = expressServer.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});

module.exports = server;
