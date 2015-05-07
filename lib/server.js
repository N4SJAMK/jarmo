import dgram            from 'dgram';
import { EventEmitter } from 'events';

// We create a socket for our server to listen to. We also create a 'proxy'
// EventEmitter as to not expose the server outside this module.
const socket  = dgram.createSocket('udp4');
const emitter = new EventEmitter();

/**
 * @external {Promise} https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
 */

/**
 * Creates a server listening on the given 'port'.
 *
 * @param {number} port Port to start the server on.
 *
 * @return {Promise} Promise that will resolve into an EventEmitter, that will
 *                   receive the 'messages'.
 */
export default function server(port) {
	return new Promise((resolve, reject) => {
		// Bind the server to the specified port, essentially starting it.
		socket.bind(port);

		// Listen to the 'error' and 'listening' events, in order to resolve
		// the promise we created and returned above. There is room for
		// improvement here, since we are using the 'once', callback in order
		// to not 'reject' or 'resolve' the Promise multiple times.
		socket.once('error', (err) => {
			return reject(err);
		});
		socket.once('listening', () => {
			return resolve(emitter);
		});

		// Each 'message' will be relayed through the 'proxy' emitter, in order
		// to not expose the server outside this module.
		socket.on('message', (message, info) => {
			return emitter.emit('message', message, info);
		});
	});
}
