const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const authorize = require('../middleware/authorize');
const recordService = require('../services/recordService');
const { createLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const { createRecordSchema, updateRecordSchema } = require('../utils/validationSchemas');

// All record routes require authentication
router.use(verifyToken);

/**
 * @swagger
 * /records:
 *   get:
 *     summary: Get all financial records (Analyst/Admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: type
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', authorize('analyst', 'admin'), async (req, res, next) => {
  try {
    const result = await recordService.getRecords(req.query);
    res.json({ error: false, data: result });
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /records/deleted:
 *   get:
 *     summary: Get all soft-deleted records (Admin only)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/deleted', authorize('admin'), async (req, res, next) => {
  try {
    const result = await recordService.getDeletedRecords(req.query);
    res.json({ error: false, data: result });
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /records/{id}:
 *   get:
 *     summary: Get a record by ID (Analyst/Admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/:id', authorize('analyst', 'admin'), async (req, res, next) => {
  try {
    const record = await recordService.getRecordById(req.params.id);
    res.json({ error: false, data: record });
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /records:
 *   post:
 *     summary: Create a new financial record (Admin only)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount: { type: number }
 *               type: { type: string }
 *               category: { type: string }
 *               date: { type: string, format: date }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Record created
 */
router.post('/', createLimiter, authorize('admin'), validate(createRecordSchema), async (req, res, next) => {
  try {
    // Add user as creator
    const record = await recordService.createRecord({ ...req.body, createdBy: req.user.id });
    res.status(201).json({ error: false, message: 'Record created', data: record });
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /records/{id}:
 *   put:
 *     summary: Update an existing record (Admin only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount: { type: number }
 *               type: { type: string }
 *               category: { type: string }
 *               date: { type: string, format: date }
 *               description: { type: string }
 *     responses:
 *       200:
 *         description: Record updated
 */
router.put('/:id', authorize('admin'), validate(updateRecordSchema), async (req, res, next) => {
  try {
    const record = await recordService.updateRecord(req.params.id, req.body);
    res.json({ error: false, message: 'Record updated', data: record });
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /records/{id}:
 *   delete:
 *     summary: Soft delete a record (Admin only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Record deleted (soft delete)
 */
router.delete('/:id', authorize('admin'), async (req, res, next) => {
  try {
    await recordService.deleteRecord(req.params.id);
    res.json({ error: false, message: 'Record deleted (soft delete)' });
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /records/{id}/restore:
 *   post:
 *     summary: Restore a soft-deleted record (Admin only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Record restored
 */
router.post('/:id/restore', authorize('admin'), async (req, res, next) => {
  try {
    await recordService.restoreRecord(req.params.id);
    res.json({ error: false, message: 'Record restored' });
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /records/{id}/hard-delete:
 *   post:
 *     summary: Hard delete a record securely (Admin only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Record deleted permanently
 */
router.post('/:id/hard-delete', authorize('admin'), async (req, res, next) => {
  try {
    await recordService.hardDeleteRecord(req.params.id);
    res.json({ error: false, message: 'Record deleted permanently' });
  } catch (err) { next(err); }
});

module.exports = router;
