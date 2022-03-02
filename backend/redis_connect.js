const redis = require('redis');

// connect to redis
let redis_client

if (process.env.REDISTOGO_URL) {
    redis_client = redis.createClient(process.env.REDISTOGO_URL);
} else {
    redis_client = redis.createClient();
}

redis_client.on('connect', function () {
    console.log('redis client connected');
});

module.exports = redis_client;