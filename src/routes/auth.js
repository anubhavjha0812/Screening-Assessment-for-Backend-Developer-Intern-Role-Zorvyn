const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const prisma = require('../lib/prisma');
const verifyToken = require('../middleware/verifyToken');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../utils/validationSchemas');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered
 */
router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) throw { status: 400, message: 'Missing fields' };
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw { status: 400, message: 'Email already exists' };
    const passwordHash = await authService.hashPassword(password);
    const user = await prisma.user.create({
      data: { email, name, passwordHash, role: 'viewer', status: 'active' }
    });
    const tokens = authService.generateTokens(user);
    res.status(201).json({
      error: false,
      message: 'User registered',
      data: { ...tokens, user: { id: user.id, email: user.email, role: user.role } }
    });
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login an existing user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json({ error: false, message: 'Login successful', data: result });
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed
 */
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshAccessToken(refreshToken);
    res.json({ error: false, message: 'Token refreshed', data: tokens });
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/me', verifyToken, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, role: true, status: true, createdAt: true }
    });
    res.json({ error: false, data: user });
  } catch (err) { next(err); }
});

module.exports = router;
