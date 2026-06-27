import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { validateRequest } from '../middleware/validate';
import { createEventValidator, updateEventValidator } from '../validators/event.validator';

const router = Router();
const controller = new EventController();

/**
 * @openapi
 * /api/events:
 *   get:
 *     tags:
 *       - Events
 *     summary: List all events
 *     description: Retrieves the complete list of scheduled and active events, populating the associated venue details.
 *     responses:
 *       200:
 *         description: List of events retrieved successfully
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
 *                   example: "Events retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/events/{id}:
 *   get:
 *     tags:
 *       - Events
 *     summary: Get an event by ID
 *     description: Retrieves the profile details of a single event using its database record identifier.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique Mongo ID identifier of the event
 *         schema:
 *           type: string
 *           example: "60d5ec49f3183c26883e002b"
 *     responses:
 *       200:
 *         description: Event details retrieved successfully
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
 *                   example: "Event retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/events:
 *   post:
 *     tags:
 *       - Events
 *     summary: Create a new event
 *     description: Registers a new event profile in the system. Enforces that endTime must be chronologically after startTime.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - venueId
 *               - startTime
 *               - endTime
 *             properties:
 *               title:
 *                 type: string
 *                 example: "IPL Final 2026"
 *               description:
 *                 type: string
 *                 example: "Championship final match between RCB and CSK"
 *               venueId:
 *                 type: string
 *                 description: Valid Mongo ID of the hosting Venue
 *                 example: "60d5ec49f3183c26883e002a"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-27T18:00:00Z"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-27T22:00:00Z"
 *               status:
 *                 type: string
 *                 enum: [scheduled, active, completed, cancelled]
 *                 example: "scheduled"
 *               capacity:
 *                 type: number
 *                 example: 45000
 *               currentOccupancy:
 *                 type: number
 *                 example: 0
 *     responses:
 *       201:
 *         description: Event created successfully
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
 *                   example: "Event created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Event'
 *       400:
 *         description: Validation failed or date range logic error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Referenced Venue ID not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', validateRequest(createEventValidator), controller.create);

/**
 * @openapi
 * /api/events/{id}:
 *   put:
 *     tags:
 *       - Events
 *     summary: Update an event
 *     description: Modifies fields of an existing event profile by sending the parameters in the body request.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique Mongo ID identifier of the event
 *         schema:
 *           type: string
 *           example: "60d5ec49f3183c26883e002b"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "IPL Final 2026 Rescheduled"
 *               status:
 *                 type: string
 *                 enum: [scheduled, active, completed, cancelled]
 *                 example: "active"
 *               currentOccupancy:
 *                 type: number
 *                 example: 22000
 *     responses:
 *       200:
 *         description: Event updated successfully
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
 *                   example: "Event updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Event'
 *       400:
 *         description: Validation failed or database execution error
 *       404:
 *         description: Event or referenced Venue ID not found
 */
router.put('/:id', validateRequest(updateEventValidator), controller.update);

/**
 * @openapi
 * /api/events/{id}:
 *   delete:
 *     tags:
 *       - Events
 *     summary: Delete an event
 *     description: Permanently removes an event profile registry from the system database.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique Mongo ID identifier of the event
 *         schema:
 *           type: string
 *           example: "60d5ec49f3183c26883e002b"
 *     responses:
 *       200:
 *         description: Event deleted successfully
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
 *                   example: "Event deleted successfully"
 *       404:
 *         description: Event not found
 */
router.delete('/:id', controller.delete);

export default router;
