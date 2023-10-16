const redis = require('redis');
const config = require('./config');

const client = redis.createClient({
  port: config.redisPort,
  host: config.redisHost,
})

client.connect(() => {
  console.log('REDIS ➤ Client connected to Redis');
});

client.on('ready', () => {
  console.log('REDIS ➤ Redis is ready to use');
});

client.on('error', (err) => {
  console.log(err.message);
});

client.on('end', () => {
  console.log('REDIS ➤ Client disconnected from Redis');
});

process.on('SIGINT', () => {
  client.quit();
});

module.exports = client
