import { Router } from "express";

const router = Router();

/**
 * @openapi
 * /api/health:
 *   get:
 *     tags:
 *       - System
 *     summary: Retrieve system health status
 *     description: Returns success state, version, and the active server timestamp.
 *     responses:
 *       200:
 *         description: System is running smoothly
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "CrowdShield AI Backend Running"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CrowdShield AI Backend Running",
    version: "1.0.0",
    timestamp: new Date(),
  });
});

export default router;
