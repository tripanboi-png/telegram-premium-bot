const config = require('../config');
const Admins = require('../database/admins');
const Users = require('../database/users');
const Logs = require('../database/logs');
const logger = require('../utils/logger');

/**
 * Save/update user in DB on every message
 */
async function saveUser(ctx, next) {
  if (!ctx.from) return next();

  const { id, username, first_name, last_name } = ctx.from;

  Users.upsert({ user_id: id, username, first_name, last_name }).catch(err =>
    logger.error('[Middleware] saveUser error:', err.message)
  );

  return next();
}

/**
 * Check if user is owner
 */
function isOwner(userId) {
  return (
    userId === config.OWNER_ID ||
    config.OWNER_IDS.includes(userId)
  );
}

/**
 * Require owner - block command if not owner
 */
function requireOwner(ctx, next) {
  if (!ctx.from) return;
  if (!isOwner(ctx.from.id)) {
    return ctx.reply('❌ Hanya owner yang dapat menggunakan perintah ini.');
  }
  return next();
}

/**
 * Require admin or owner
 */
async function requireAdmin(ctx, next) {
  if (!ctx.from) return;
  const userId = ctx.from.id;

  if (isOwner(userId)) return next();

  const adminCheck = await Admins.isAdmin(userId);
  if (!adminCheck) {
    return ctx.reply('❌ Hanya admin yang dapat menggunakan perintah ini.');
  }

  return next();
}

/**
 * Check if user is banned
 */
async function checkBan(ctx, next) {
  if (!ctx.from) return next();

  const { data: user } = await Users.getById(ctx.from.id);
  if (user?.is_banned) {
    return ctx.reply('🚫 Anda telah di-banned dari bot ini.');
  }

  return next();
}

/**
 * Log admin actions
 */
async function logAction(userId, action, details) {
  Logs.add({ user_id: userId, action, details }).catch(() => {});
}

module.exports = { saveUser, isOwner, requireOwner, requireAdmin, checkBan, logAction };
