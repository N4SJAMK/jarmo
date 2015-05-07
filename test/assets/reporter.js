import { EventEmitter } from 'events';

const emitter = new EventEmitter();

export default {
	flush(data) {
		return data.map(emitter.emit.bind(emitter, 'data'));
	},
	name: 'test-reporter',
	emitter: emitter
}
