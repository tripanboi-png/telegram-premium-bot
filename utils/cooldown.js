const config = require('../config');

// In-memory cooldown store
const cooldownMap = new Map();
const spamMap = new Map();

const Cooldown = {
  /**
   * Check if user is on cooldown. Returns true if cooldown active.
   */
  check(userId) {
    const key = String(userId);
    const now = Date.now();
    const lastTime = cooldownMap.get(key) || 0;
    if (now - lastTime < config.COOLDOWN_SECONDS * 1000) return true;
    cooldownMap.set(key, now);
    return false;
  },

  /**
   * Track spam count. Returns true if spam detected.
   */
  trackSpam(userId) {
    const key = String(userId);
    const now = Date.now();
    const entry = spamMap.get(key) || { count: 0, window: now };

    // Reset window every 10 seconds
    if (now - entry.window > 10000) {
      spamMap.set(key, { count: 1, window: now });
      return false;
    }

    entry.count++;
    spamMap.set(key, entry);
    return entry.count > config.MAX_SPAM_COUNT;
  },

  /**
   * Reset user cooldown
   */
  reset(userId) {
    cooldownMap.delete(String(userId));
    spamMap.delete(String(userId));
  },

  /**
   * Clear expired entries (run periodically)
   */
  cleanup() {
    const now = Date.now();
    for (const [key, time] of cooldownMap.entries()) {
      if (now - time > config.COOLDOWN_SECONDS * 1000 * 10) {
        cooldownMap.delete(key);
      }
    }
  },
};

// Auto cleanup every 5 minutes
setInterval(() => Cooldown.cleanup(), 5 * 60 * 1000);

module.exports = Cooldown;
