const rateLimit = require('express-rate-limit');
const generalLimiter = rateLimit({ windowMs: 15*60*1000, max: 100 });
const authLimiter = rateLimit({ windowMs: 15*60*1000, max: 20, skipSuccessfulRequests: true });
const createLimiter = rateLimit({ windowMs: 60*1000, max: 15, keyGenerator: (req) => req.user?.id || req.ip });
module.exports = { generalLimiter, authLimiter, createLimiter };
