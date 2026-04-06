const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const authorize = require('../middleware/authorize');
const dashboardService = require('../services/dashboardService');

router.use(verifyToken, authorize('viewer', 'analyst', 'admin'));

/**
 * @swagger
 * /dashboard/summary:
 *   get:
 *     summary: Get dashboard financial summary
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/summary', async (req, res, next) => {
  try {
    const summary = await dashboardService.getSummary(req.query);
    res.json({ error: false, data: summary });
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /dashboard/by-category:
 *   get:
 *     summary: Get financial records by category
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/by-category', async (req, res, next) => {
  try {
    const data = await dashboardService.getByCategory(req.query.type);
    res.json({ error: false, data });
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /dashboard/trends:
 *   get:
 *     summary: Get financial trends over months
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: months
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/trends', async (req, res, next) => {
  try {
    const trends = await dashboardService.getTrends(parseInt(req.query.months) || 6);
    res.json({ error: false, data: trends });
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /dashboard/recent:
 *   get:
 *     summary: Get recent financial transactions
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/recent', async (req, res, next) => {
  try {
    const recent = await dashboardService.getRecent(parseInt(req.query.limit) || 10);
    res.json({ error: false, data: recent });
  } catch (err) { next(err); }
});

module.exports = router;
