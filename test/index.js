import dgram  from 'dgram';
import assert from 'assert';

import reporter from './assets/reporter';

// For testing purposes we use a special 'config' file. Refer to it for more
// information on how the tests are done.
process.env.JARMO_CONFIG_FILE = './test/assets/config';

/**
 * Simple UDP client factory.
 */
function client(host, port) {
	let clientUDP = dgram.createSocket('udp4');

	return function send(data) {
		let buffer = new Buffer(JSON.stringify(data));
		clientUDP.send(buffer, 0, buffer.length, port, host);
	}
}

describe('Jarmo Server', () => {
	let send = client('localhost', 8000);

	before((done) => {
		// Make sure we have a running Jarmo server...
		require('..'); setTimeout(done, 200);
	});

	it('Should flush to reporters', (done) => {
		reporter.emitter.once('data', () => done());
		return send({ foo: 'bar' });
	});

	it('Should add timestamps automatically', (done) => {
		reporter.emitter.once('data', (payload) => {
			assert(payload.hasOwnProperty('timestamp'));
			return done();
		});
		return send({ bar: 'baz' });
	});
});
