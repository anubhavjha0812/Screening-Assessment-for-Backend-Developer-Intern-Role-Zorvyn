const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const authorize = require('../middleware/authorize');
const prisma = require('../lib/prisma');
const authService = require('../services/authService');
const validate = require('../middleware/validate');
const { createUserSchema, updateUserSchema } = require('../utils/validationSchemas');

router.use(verifyToken, authorize('admin'));

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user (Admin only)
 *     security: [{ bearerAuth: [] }]
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
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 */
router.post('/', validate(createUserSchema), async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body;
    const passwordHash = await authService.hashPassword(password);
    const user = await prisma.user.create({
      data: { email, name, passwordHash, role: role || 'viewer', status: 'active' }
    });
    res.status(201).json({ error: false, message: 'User created', data: { id: user.id, email, name, role: user.role } });
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Admin only)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, status: true, createdAt: true }
    });
    res.json({ error: false, data: users });
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/:id', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { id: true, email: true, name: true, role: true, status: true, createdAt: true }
    });
    if (!user) throw { status: 404, message: 'User not found' };
    res.json({ error: false, data: user });
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user (Admin only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 */
router.put('/:id', validate(updateUserSchema), async (req, res, next) => {
  try {
    const { name, role, status } = req.body;
    await prisma.user.update({
      where: { id: req.params.id },
      data: { name, role, status }
    });
    res.json({ error: false, message: 'User updated' });
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Deactivate user (Admin only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deactivated
 */
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.user.update({
      where: { id: req.params.id },
      data: { status: 'inactive' }
    });
    res.json({ error: false, message: 'User deactivated' });
  } catch (err) { next(err); }
});

module.exports = router;
