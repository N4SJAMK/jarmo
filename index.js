import 'babel/polyfill';

import log    from './lib/utils/log';
import parse  from './lib/utils/parse';
import server from './lib/server';

// The default configuration, which can be overwritten by the user.
let config = {
	port: 8000, flush_interval: 10000, reporters: [ ], memoize: false
}

try {
	// Attempt to load the configuration file and merge it with the default
	// configuration. You can specify a custom configuration file location by
	// defining the JARMO_CONFIG_FILE environmental variable.
	config = Object.assign(config,
		require( process.env.JARMO_CONFIG_FILE || './config' ));
}
catch(err) {
	log('Failed to load the configuration, using defaults...');
}

// We use explicit 'require' statement to load the reporter modules. This is so
// that there's no confusion since we are using ES6 module syntax otherwise.
let reporters = config.reporters.map((path) => {
	try {
		// First we attempt to require the reporter module.
		let reporter = require(path);
		// Make sure the reporter has compatible interface, e.g. we can 'flush'
		// the collected data to it.
		if(reporter.flush && typeof reporter.flush === 'function') {
			return reporter;
		}
		else throw new Error(`Invalid interface for reporter ${reporter}`);
	}
	catch(err) {
		log(err.message);
		return process.exit(1);
	}
});

// After we've made sure to load each reporter, we attempt to initialize them
// if possible. If 'config' contains a field corresponding to the reporter's
// name, it will be passed to the reporter's 'initialize' function.
reporters.forEach((reporter) => {
	log(`Succesfully loaded reporter ${reporter.name}`);
	// Not all reporters have to define an initialization function.
	if(reporter.initialize && typeof reporter.initialize === 'function') {
		return reporter.initialize(config[reporter.name]);
	}
});

// Received messages are stored as 'points' of data. Upon each flush cycle, the
// points are flushed to 'reporters' and the points are reset.
let points = [ ];

// If the flush interval is set to be zero, no flush cycle is ran and instead
// data is flushed to reporters as soon as it is received.
if(config.flush_interval > 0) {
	setInterval(() => flush(points).then(clear, log), config.flush_interval);
}

/**
 * Clear the 'data points'. Meant to be used with each flush cycle.
 */
function clear() {
	points = [ ];
}

/**
 * Flush the given datapoints to the reporters. Note that this does not clear
 * the given points after flushing them to the reporters.
 *
 * @param  {object[]} points  The points of data to be 'flushed'.
 * @return {Promise}          Promise resolved when the points have been
 *                            flushed to configured reporters.
 */
function flush(points) {
	return Promise.all(reporters.map((reporter) => reporter.flush(points)));
}

/**
 * When the server is up and running, we start listening to messages, which are
 * then distributed to the registered 'reporter' modules.
 *
 * @param {EventEmitter} emitter  The emitter which we listen to in order to
 *                                receive 'messages' received by the server.
 */
function listen(emitter) {
	// Listen to 'message' events, from the given EventEmitter.
	emitter.on('message', (message) => {
		// Each message is, in a sense, a 'data point'. We also make sure to
		// record the timestamp of when the message was received.
		let point = {
			data:      parse(message, config.memoize),
			timestamp: new Date().toISOString()
		}

		// If the 'flush_interval' is set to a zero, we flush immediately as we
		// receive the data, no waiting around for the 'flush_interval'.
		if(config.flush_interval === 0) return flush([ point ]).catch(log);

		// We store these points so that we can 'flush' them in a set interval.
		return points.push(point);
	});
	return log(`Server listening to port ${config.port}...`);
}

// Start the server, if there is an error starting the server we log it and
// make sure the process exits.
server(config.port).then(listen, (err) => {
	log(err.message);
	return process.exit(1);
});
