import { Router } from 'express';
import { CrowdReadingController } from '../controllers/crowd_reading.controller';
import { validateRequest } from '../middleware/validate';
import { createCrowdReadingValidator, updateCrowdReadingValidator } from '../validators/crowd_reading.validator';

const router = Router();
const controller = new CrowdReadingController();

/**
 * @openapi
 * /api/crowd-readings:
 *   get:
 *     tags:
 *       - Crowd Readings
 *     summary: List all crowd readings
 *     description: Retrieves the complete log of crowd reading records registered across all events and venues.
 *     responses:
 *       200:
 *         description: List of crowd readings retrieved successfully
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
 *                   example: "Crowd readings retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CrowdReading'
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/crowd-readings/{id}:
 *   get:
 *     tags:
 *       - Crowd Readings
 *     summary: Get a crowd reading by ID
 *     description: Retrieves profile parameters of a single telemetry reading using its database identifier.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique Mongo ID identifier of the reading
 *         schema:
 *           type: string
 *           example: "60d5ec49f3183c26883e002c"
 *     responses:
 *       200:
 *         description: Crowd reading details retrieved successfully
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
 *                   example: "Crowd reading retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/CrowdReading'
 *       404:
 *         description: Reading not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/crowd-readings/event/{eventId}:
 *   get:
 *     tags:
 *       - Crowd Readings
 *     summary: List crowd readings by Event ID
 *     description: Retrieves the complete time-series telemetry log of crowd readings for a specific event.
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
 *         description: Time-series event readings retrieved successfully
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
 *                   example: "Crowd readings for event 60d5ec49f3183c26883e002b retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CrowdReading'
 *       404:
 *         description: Event not found
 */
router.get('/event/:eventId', controller.getByEvent);

/**
 * @openapi
 * /api/crowd-readings:
 *   post:
 *     tags:
 *       - Crowd Readings
 *     summary: Register a new crowd reading
 *     description: Registers a new crowd sensor/camera telemetry reading. Automatically updates the hosting event's occupancy count and computes risk levels.
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
 *                 description: Valid event database identifier
 *                 example: "60d5ec49f3183c26883e002b"
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-27T10:25:00Z"
 *               crowdCount:
 *                 type: number
 *                 example: 38420
 *               entryRate:
 *                 type: number
 *                 example: 420
 *               exitRate:
 *                 type: number
 *                 example: 165
 *               temperature:
 *                 type: number
 *                 example: 35
 *               humidity:
 *                 type: number
 *                 example: 72
 *               weather:
 *                 type: string
 *                 example: "Sunny"
 *               riskScore:
 *                 type: number
 *                 description: Auto-computed if omitted
 *                 example: 45
 *               threatLevel:
 *                 type: string
 *                 enum: [Low, Elevated, Severe]
 *                 description: Auto-computed if omitted
 *                 example: "Elevated"
 *     responses:
 *       201:
 *         description: Telemetry registered successfully
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
 *                   example: "Crowd reading registered successfully"
 *                 data:
 *                   $ref: '#/components/schemas/CrowdReading'
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Referenced Event not found
 */
router.post('/', validateRequest(createCrowdReadingValidator), controller.create);

/**
 * @openapi
 * /api/crowd-readings/{id}:
 *   put:
 *     tags:
 *       - Crowd Readings
 *     summary: Update a crowd reading
 *     description: Modifies parameters of an existing crowd reading profile.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique Mongo ID identifier of the reading
 *         schema:
 *           type: string
 *           example: "60d5ec49f3183c26883e002c"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               crowdCount:
 *                 type: number
 *                 example: 39000
 *     responses:
 *       200:
 *         description: Reading updated successfully
 *       404:
 *         description: Reading not found
 */
router.put('/:id', validateRequest(updateCrowdReadingValidator), controller.update);

/**
 * @openapi
 * /api/crowd-readings/{id}:
 *   delete:
 *     tags:
 *       - Crowd Readings
 *     summary: Delete a crowd reading
 *     description: Permanently removes a crowd telemetry registry from the database.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique Mongo ID identifier of the reading
 *         schema:
 *           type: string
 *           example: "60d5ec49f3183c26883e002c"
 *     responses:
 *       200:
 *         description: Reading deleted successfully
 *       404:
 *         description: Reading not found
 */
router.delete('/:id', controller.delete);

export default router;
