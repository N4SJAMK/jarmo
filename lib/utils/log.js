/**
 * Simple logging module. Using this, we can push logs to some external service
 * with great ease.
 */
export default log;

/**
 * Log the given message with current time included.
 *
 * @param {string|mixed} message  The message to be logged, can also be some
 *                                sort of an object such as Error.
 */
function log(message) {
	console.log(`[ ${new Date().toISOString()} ] ${message}`);
}

/**
 * Log the given message with current time included. Will invoke 'process.exit'
 * once the message has been logged, essentially shutting down the program.
 *
 * @param {string|mixed} message  The message to be logged, can also be some
 *                                sort of an object such as Error.
 */
log.panic = function panic(message) {
	log(message);
	return process.exit(1);
}
