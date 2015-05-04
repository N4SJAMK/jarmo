# Jarmo

<img align="center" src="http://i.imgur.com/8paRPGe.png" />

Jarmo is a simple StatsD-like server. This means that Jarmo can be used for
stats aggregation similarly to [StatsD](https://github.com/etsy/statsd).

However there are a few differences. Jarmo does not define any metric types,
instead it expects data to be sent in a `JSON` format. Jarmo merely parses the
received data as `JSON` and adds a `timestamp` to the data as it is received.

Jarmo runs a `flush cycle`, similarly to StatsD. Upon the end of each cycle,
all the received data is `flushed` to `reporters`, which in StatsD terms are
defined as `backends`.

## Configuration
The available configuration is listed below:

```javascript
  export default {
    reporters: [
      '../reporters/influxdb'
      // List the 'require':able paths of wanted reporters here...
    ],
    memoize:        false,  // Whether to 'cache' received data.
    port:           8000,   // Port to run the service on.
    flush_interval: 10000   // The interval between flushes (in milliseconds).
                            // If set to zero, received data will be flushed to
                            // reporters as soon as it is received.
  }
```

### Reporter Configuration
Each reporter defines a `name`, for example our `influxdb-reporter` is simply
called `influxdb` here. In order to pass configuration to `initialize` method
of the reporter, we add the configuration object with the key `influxdb` to our
configuration file, like so:

```javascript
  export default {
    influxdb: {
      // reporter configuration for 'influxdb' goes here!
    },
    reporters: [
      '../reporters/influxdb'
    ],
    host: 'localhost'
  }
```

### Reporter Interface
Reporters must be requireable using the NodeJS `require`. The exported module
must have a `flush` function, which unsurprisingly is called each time data is
to be flushed.

If a reporter defines an `initialize` function, it is called during the server
initialization phase after reporters have been loaded. It is given the config
hash keyed by its `name` in the server's configuration file.

## Running
```
npm install && npm start
```

## Sending Data
Jarmo expects simple JSON messages delivered via UDP.
```
echo "{\"foo\":\"bar\"}" | nc -u -w0 localhost 8000
```
Do note that Jarmo does not format your messages in any way. In fact it is the
`reporter` that is responsible for extracting the required data from the `JSON`
messages and reporting it to wherever.
