import log from '../utils/log';

// A 'cache' of sorts, meant to store parsed objects keyed by their hashes. Do
// note that this is not necessarily even needed, as we simply use 'JSON.parse'
// to parse the message. However the memoization can be turned off if needed.
let cache = { }

/**
 * Parse the given message into an object.
 *
 * @param {string}  message  The JSON message string.
 * @param {boolean} memoize  Flag indicating whether to 'cache' results.
 *
 * @return {object} The resulting object.
 */
export default function parse(message, memoize = false) {
	// Try and get the resulting object from the 'cache', so that we don't have
	// to parse identical objects continuously.
	let result = memoize ? (cache[message] || null) : null;

	// If we have a memoized result for the given message, we return that.
	if(memoize && result) return result;

	try {
		result = JSON.parse(message);
	}
	catch(err) {
		return log(`Failed to parse ${message}`);
	}

	// Put the parsed message into the cache and return the resulting object.
	if(memoize) {
		cache[message] = result;
	}
	return result;
}
