export default {
	reporters: [
		// Use the custom test reporter for our test run.
		'./test/assets/reporter'
	],
	// Make sure that we disable the flush cycle for tests, so we don't need to
	// wait around for it and instead receive the events instantly.
	flush_interval: 0
}
