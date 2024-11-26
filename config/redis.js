const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
});

redis.on('connect', () => {
  console.log('Connecté à Redis avec succès');
});

redis.on('error', (error) => {
  console.error('Erreur de connexion Redis :', error.message);
});

module.exports = redis;
