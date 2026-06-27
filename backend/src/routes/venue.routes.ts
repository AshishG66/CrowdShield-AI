import { Router } from 'express';
import { VenueController } from '../controllers/venue.controller';
import { validateRequest } from '../middleware/validate';
import { createVenueValidator, updateVenueValidator } from '../validators/venue.validator';

const router = Router();
const controller = new VenueController();

/**
 * @openapi
 * /api/venues:
 *   get:
 *     tags:
 *       - Venues
 *     summary: List all venues
 *     description: Retrieves the complete list of registered venues, containing geographic coordinates, gates, capacities, and active telemetries.
 *     responses:
 *       200:
 *         description: List of venues retrieved successfully
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
 *                   example: "Venues retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Venue'
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/venues/{id}:
 *   get:
 *     tags:
 *       - Venues
 *     summary: Get a venue by ID
 *     description: Retrieves the profile details of a single venue using its database record identifier.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique Mongo ID identifier of the venue
 *         schema:
 *           type: string
 *           example: "60d5ec49f3183c26883e002a"
 *     responses:
 *       200:
 *         description: Venue details retrieved successfully
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
 *                   example: "Venue retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Venue'
 *       404:
 *         description: Venue not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/venues:
 *   post:
 *     tags:
 *       - Venues
 *     summary: Create a new venue
 *     description: Registers a new venue profile in the system. The payload is validated strictly by Zod schema checking.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - city
 *               - state
 *               - capacity
 *               - latitude
 *               - longitude
 *             properties:
 *               name:
 *                 type: string
 *                 example: "M. Chinnaswamy Stadium"
 *               type:
 *                 type: string
 *                 example: "Stadium"
 *               city:
 *                 type: string
 *                 example: "Bengaluru"
 *               state:
 *                 type: string
 *                 example: "Karnataka"
 *               country:
 *                 type: string
 *                 example: "India"
 *               capacity:
 *                 type: number
 *                 example: 45000
 *               latitude:
 *                 type: number
 *                 example: 12.9784
 *               longitude:
 *                 type: number
 *                 example: 77.5994
 *               entryGates:
 *                 type: number
 *                 example: 8
 *               exitGates:
 *                 type: number
 *                 example: 8
 *               emergencyExits:
 *                 type: number
 *                 example: 4
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *                 example: "Active"
 *     responses:
 *       201:
 *         description: Venue created successfully
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
 *                   example: "Venue created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Venue'
 *       400:
 *         description: Validation failed or name duplicate
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', validateRequest(createVenueValidator), controller.create);

/**
 * @openapi
 * /api/venues/{id}:
 *   put:
 *     tags:
 *       - Venues
 *     summary: Update a venue
 *     description: Modifies fields of an existing venue profile by sending the parameters in the body request.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique Mongo ID identifier of the venue
 *         schema:
 *           type: string
 *           example: "60d5ec49f3183c26883e002a"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               capacity:
 *                 type: number
 *                 example: 50000
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive, secure, elevated, emergency]
 *                 example: "Inactive"
 *     responses:
 *       200:
 *         description: Venue updated successfully
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
 *                   example: "Venue updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Venue'
 *       400:
 *         description: Validation failed or database execution error
 *       404:
 *         description: Venue not found
 */
router.put('/:id', validateRequest(updateVenueValidator), controller.update);

/**
 * @openapi
 * /api/venues/{id}:
 *   delete:
 *     tags:
 *       - Venues
 *     summary: Delete a venue
 *     description: Permanently removes a venue profile registry from the system database.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique Mongo ID identifier of the venue
 *         schema:
 *           type: string
 *           example: "60d5ec49f3183c26883e002a"
 *     responses:
 *       200:
 *         description: Venue deleted successfully
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
 *                   example: "Venue deleted successfully"
 *       404:
 *         description: Venue not found
 */
router.delete('/:id', controller.delete);

export default router;
