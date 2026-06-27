import { Router } from 'express';
import { IncidentController } from '../controllers/incident.controller';
import { validateRequest } from '../middleware/validate';
import { createIncidentValidator, updateIncidentValidator } from '../validators/incident.validator';

const router = Router();
const controller = new IncidentController();

/**
 * @openapi
 * /api/incidents:
 *   get:
 *     tags:
 *       - Incidents
 *     summary: List all incidents
 *     description: Retrieves the complete log of active, under-investigation, and resolved safety incidents.
 *     responses:
 *       200:
 *         description: List of incidents retrieved successfully
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
 *                   example: "Incidents retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Incident'
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/incidents/{id}:
 *   get:
 *     tags:
 *       - Incidents
 *     summary: Get an incident by ID
 *     description: Retrieves detailed attributes of a single safety ticket.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique Mongo ID identifier of the incident
 *         schema:
 *           type: string
 *           example: "60d5ec49f3183c26883e002e"
 *     responses:
 *       200:
 *         description: Incident details retrieved successfully
 *       404:
 *         description: Incident not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/incidents/event/{eventId}:
 *   get:
 *     tags:
 *       - Incidents
 *     summary: List incidents by Event ID
 *     description: Retrieves all active and historical incidents logged for a specific event.
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
 *         description: Event incidents logs retrieved successfully
 *       404:
 *         description: Event not found
 */
router.get('/event/:eventId', controller.getByEvent);

/**
 * @openapi
 * /api/incidents:
 *   post:
 *     tags:
 *       - Incidents
 *     summary: Create an incident manually
 *     description: Manually registers a safety incident ticket inside the command center.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - location
 *             properties:
 *               incidentId:
 *                 type: string
 *                 description: Sequential ticket ID (generated automatically if omitted)
 *                 example: "INC-105"
 *               title:
 *                 type: string
 *                 example: "Exit Gate 2 Blockage"
 *               description:
 *                 type: string
 *                 example: "Litter bin obstruction impeding crowd exit flow rates."
 *               location:
 *                 type: string
 *                 example: "Auxiliary Gate Corridor F"
 *               severity:
 *                 type: string
 *                 enum: [info, warning, critical]
 *                 example: "warning"
 *               status:
 *                 type: string
 *                 enum: [active, investigating, resolved]
 *                 example: "active"
 *               assignedOfficer:
 *                 type: string
 *                 example: "Marshal Ramesh K"
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, critical]
 *                 example: "medium"
 *               eventId:
 *                 type: string
 *                 example: "60d5ec49f3183c26883e002b"
 *     responses:
 *       201:
 *         description: Incident created successfully
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
 *                   example: "Incident created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Incident'
 *       400:
 *         description: Validation failed
 */
router.post('/', validateRequest(createIncidentValidator), controller.create);

/**
 * @openapi
 * /api/incidents/{id}:
 *   put:
 *     tags:
 *       - Incidents
 *     summary: Update an incident
 *     description: Modifies parameters of an existing incident, such as changing status, resolution comment, or assigned officer.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique Mongo ID identifier of the incident
 *         schema:
 *           type: string
 *           example: "60d5ec49f3183c26883e002e"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, investigating, resolved]
 *                 example: "resolved"
 *               assignedOfficer:
 *                 type: string
 *                 example: "Officer Ramesh"
 *               resolution:
 *                 type: string
 *                 example: "Gate cleared by auxiliary staff."
 *     responses:
 *       200:
 *         description: Incident updated successfully
 *       404:
 *         description: Incident not found
 */
router.put('/:id', validateRequest(updateIncidentValidator), controller.update);

/**
 * @openapi
 * /api/incidents/{id}:
 *   delete:
 *     tags:
 *       - Incidents
 *     summary: Delete an incident log
 *     description: Permanently removes an incident assessment log from the database.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique Mongo ID identifier of the incident
 *         schema:
 *           type: string
 *           example: "60d5ec49f3183c26883e002e"
 *     responses:
 *       200:
 *         description: Incident deleted successfully
 *       404:
 *         description: Incident not found
 */
router.delete('/:id', controller.delete);

export default router;
