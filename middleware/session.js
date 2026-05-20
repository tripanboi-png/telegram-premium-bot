/**
 * Simple in-memory session middleware
 * For production, consider using telegraf-session-local or Redis
 */
const sessions = new Map();

function sessionMiddleware(ctx, next) {
  const id = ctx.from?.id || ctx.chat?.id;
  if (!id) return next();

  if (!sessions.has(id)) {
    sessions.set(id, {});
  }

  ctx.session = sessions.get(id);

  return next();
}

// Clean up old sessions every hour
setInterval(() => {
  // Simple strategy: clear all. For production, use TTL.
  if (sessions.size > 10000) sessions.clear();
}, 60 * 60 * 1000);

module.exports = { sessionMiddleware };
