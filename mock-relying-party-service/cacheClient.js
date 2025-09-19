const NodeCache = require("node-cache");

const DEFAULT_TTL_SECONDS = 600;
const CHECK_PERIOD_SECONDS = 120;

const dpopCache = new NodeCache({
  stdTTL: DEFAULT_TTL_SECONDS,
  checkperiod: CHECK_PERIOD_SECONDS,
});

const cache = {
  /**
   * Get a value from the cache.
   * @param {string} key
   * @returns {Promise<any|undefined>} resolved value or undefined when not present
   */
  async get(key) {
    return dpopCache.get(key);
  },

  /**
   * Set a value in the cache.
   * @param {string} key
   * @param {any} value
   * @returns {Promise<void>}
   */
  async set(key, value) {
    dpopCache.set(key, value);
  },

  /**
   * Delete a value from cache.
   * @param {string} key
   * @returns {Promise<void>}
   */
  async del(key) {
    dpopCache.del(key);
  },

  /**
   * Clear all cache entries.
   * @returns {Promise<void>}
   */
  async clear() {
    dpopCache.flushAll();
  },
};

module.exports = { cache };
