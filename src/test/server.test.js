const server = require('../server');

describe('Server Module', () => {
	it('should exports an express object with listen function', () => {
		expect(typeof server.listen).toBe('function');
	});
});
