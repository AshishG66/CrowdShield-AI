import { Router } from 'express';
import { PredictionController } from '../controllers/prediction.controller';
import { validateRequest } from '../middleware/validate';
import { createCrowdReadingValidator } from '../validators/crowd_reading.validator';

const router = Router();
const controller = new PredictionController();

/**
 * @openapi
 * /api/predictions:
 *   get:
 *     tags:
 *       - Predictions
 *     summary: List all predictions
 *     description: Retrieves the complete log of active and historical crowd density anomalies and risks predictions.
 *     responses:
 *       200:
 *         description: List of predictions retrieved successfully
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
 *                   example: "Predictions retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Prediction'
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/predictions/{id}:
 *   get:
 *     tags:
 *       - Predictions
 *     summary: Get a prediction by ID
 *     description: Retrieves detailed attributes of a single prediction assessment.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique Mongo ID identifier of the prediction
 *         schema:
 *           type: string
 *           example: "60d5ec49f3183c26883e002d"
 *     responses:
 *       200:
 *         description: Prediction details retrieved successfully
 *       404:
 *         description: Prediction not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/predictions/event/{eventId}:
 *   get:
 *     tags:
 *       - Predictions
 *     summary: List predictions by Event ID
 *     description: Retrieves the complete time-series log of predictions generated for a specific event.
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         description: The unique Mongo ID of the target Event
 *         schema:
 *           type: string
 *           example: "60d5ec49f3183c26883e002b"
 *     responses:
 *       200:
 *         description: Event predictions logs retrieved successfully
 *       404:
 *         description: Event not found
 */
router.get('/event/:eventId', controller.getByEvent);

/**
 * @openapi
 * /api/predictions/trigger:
 *   post:
 *     tags:
 *       - Predictions
 *     summary: Manually trigger an AI prediction cycle
 *     description: Forwards crowd telemetry payload to the FastAPI model microservice to compute anomaly risks. Automatically writes a new prediction record.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *               - crowdCount
 *               - entryRate
 *               - exitRate
 *             properties:
 *               eventId:
 *                 type: string
 *                 example: "60d5ec49f3183c26883e002b"
 *               crowdCount:
 *                 type: number
 *                 example: 38420
 *               entryRate:
 *                 type: number
 *                 example: 420
 *               exitRate:
 *                 type: number
 *                 example: 165
 *     responses:
 *       201:
 *         description: Prediction calculated and written successfully
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
 *                   example: "Prediction triggered and saved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Prediction'
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Referenced Event not found
 */
router.post('/trigger', validateRequest(createCrowdReadingValidator), controller.trigger);

/**
 * @openapi
 * /api/predictions/{id}:
 *   delete:
 *     tags:
 *       - Predictions
 *     summary: Delete a prediction log
 *     description: Permanently removes a prediction assessment log from the database.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique Mongo ID identifier of the prediction
 *         schema:
 *           type: string
 *           example: "60d5ec49f3183c26883e002d"
 *     responses:
 *       200:
 *         description: Prediction deleted successfully
 *       404:
 *         description: Prediction not found
 */
router.delete('/:id', controller.delete);

export default router;
