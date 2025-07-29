const {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
  CACHE_TYPE,
} = require("./config");

const cacheType = CACHE_TYPE;

let cache;

if (cacheType && cacheType === "redis") {
  const Redis = require("ioredis");
  cache = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
  });
} else {
  cache = {
    store: {},
    async get(key) {
      return this.store[key];
    },
    async set(key, value, ...args) {
      this.store[key] = value;
    },
    async del(key) {
      delete this.store[key];
    },
  };
}

module.exports = cache;
