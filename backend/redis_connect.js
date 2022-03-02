const redis = require('redis');

// connect to redis
let redis_client

if (process.env.REDISTOGO_URL) {
    redis_client = redis.createClient(process.env.REDISTOGO_URL);

    var rtg = redis.parse(process.env.REDISTOGO_URL);
    var redis = redis.createClient(rtg.port, rtg.hostname);

    redis.auth(rtg.auth.split(":")[1]);
} else {
    redis_client = redis.createClient();
}

redis_client.on('connect', function () {
    console.log('redis client connected');
});

module.exports = redis_client;