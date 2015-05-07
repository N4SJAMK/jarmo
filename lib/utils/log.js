/**
 * Log the given message with current time included.
 *
 * @param {string} message  The message to be logged.
 */
export default function log(message) {
	console.log(`[ ${new Date().toISOString()} ] ${message}`);
}
