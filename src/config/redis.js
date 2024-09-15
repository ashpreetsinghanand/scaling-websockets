const redis = require("redis");

// Create Redis clients
const redisClient = redis.createClient({
    socket: {
      host: 'redis-13253.c305.ap-south-1-1.ec2.redns.redis-cloud.com',
      port: 13253,
    },
    password: 'Rw6AgyI6ZJHe6EHDprD1FEsGPzTiU24j'
  });
  
  const pubClient = redis.createClient({
    socket: {
      host: 'redis-13253.c305.ap-south-1-1.ec2.redns.redis-cloud.com',
      port: 13253,
    },
    password: 'Rw6AgyI6ZJHe6EHDprD1FEsGPzTiU24j'
  });
  
  const subClient = redis.createClient({
    socket: {
      host: 'redis-13253.c305.ap-south-1-1.ec2.redns.redis-cloud.com',
      port: 13253,
    },
    password: 'Rw6AgyI6ZJHe6EHDprD1FEsGPzTiU24j'
});

// Enable Redis v4 promises support
(async () => {
  await redisClient.connect();
  await pubClient.connect();
  await subClient.connect();
})();

module.exports = { redisClient, pubClient, subClient };


