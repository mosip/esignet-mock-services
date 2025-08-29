const cache = {
  store: {},

  /**
   * Get a value from the cache.
   * @param {string} key - Cache key
   * @returns {Promise<string|null>} - Cached value or null if not found
   */
  async get(key) {
    return this.store[key] || null;
  },

  /**
   * Set a value in the cache.
   * @param {string} key - Cache key
   * @param {string} value - Value to cache
   * @param  {...any} args - Additional arguments(if present)
   */
  async set(key, value, ...args) {
    this.store[key] = value;
  },

  /**
   * Clear all cache entries.
   */
  async clear() {
    this.store = {};
  },

  /**
   * Delete a value from cache.
   * @param {string} key - Cache key
   */
  async del(key) {
    delete this.store[key];
  },
};

module.exports = cache;
