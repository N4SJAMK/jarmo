export default {
	influxdb: {
		port:     8086,
		host:     'localhost',
		username: 'test',
		password: 'test',
		database: 'test'
	},
	reporters: [
		'../reporters/influxdb'
	],
	flush_interval: 2000
}
