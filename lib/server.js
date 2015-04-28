import dgram            from 'dgram';
import { EventEmitter } from 'events';

// We create a socket for our server to listen to. We also create a 'proxy'
// EventEmitter as to not expose the server outside this module.
const server  = dgram.createSocket('udp4');
const emitter = new EventEmitter();

export default {
	/**
	 * Start the UDP server on the given 'port'.
	 *
	 * @param {number} port  Port to start the server on.
	 *
	 * @return {Promise} Promise that will resolve into an EventEmitter, that
	 *                   will receive 'messages'.
	 */
	listen(port) {
		return new Promise((resolve, reject) => {
			// Bind the server to the specified port, essentially starting it.
			server.bind(port);

			// Listen to the 'error' and 'listening' events, in order to
			// resolve the promise we created and returned above. There is room
			// for improvement here, since we are using the 'once', callback in
			// order to not 'reject' or 'resolve' the Promise multiple times.
			server.once('error', (err) => {
				return reject(err);
			});
			server.once('listening', () => {
				return resolve(emitter);
			});

			// Each 'message' will be relayed through the 'proxy' emitter, in
			// order to not expose the server outside this module.
			server.on('message', (message, info) => {
				return emitter.emit('message', message, info);
			});
		});
	}
}
