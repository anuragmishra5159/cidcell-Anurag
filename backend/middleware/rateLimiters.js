const rateLimit = require('express-rate-limit');

/**
 * 🔴 AUTH LIMITER — Relaxed for campus NAT
 * Google OAuth on a shared college network can have many students behind the
 * same IP (NAT). The previous limit of 10/15min would block classmates.
 * 50 requests per 15 minutes is still strict enough to prevent brute-force
 * while allowing a realistic campus environment.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { message: 'Too many login attempts from this IP. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * 🟡 WRITE LIMITER — Standard
 * Protects mutation endpoints (POST/PUT/DELETE) from spam.
 * 30 requests per 10 minutes per IP.
 */
const writeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  message: { message: 'Too many write requests from this IP. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * 🟢 READ LIMITER — Generous
 * Used for public/page-load GET endpoints that are hit on every page navigation.
 * 300 requests per 15 minutes per IP.
 */
const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { message: 'Too many read requests from this IP. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * 🩵 CHAT LIMITER — High Volume
 * Used for chat/messaging endpoints that are polled frequently.
 * 200 requests per 5 minutes per IP.
 */
const chatLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 200,
  message: { message: 'Chat rate limit exceeded. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * ⚪ GLOBAL FALLBACK LIMITER
 * Safety net for all other routes not specifically covered above.
 * 200 requests per 15 minutes per IP.
 */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, writeLimiter, readLimiter, chatLimiter, globalLimiter };
