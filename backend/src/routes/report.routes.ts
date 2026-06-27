import { Router } from 'express';
import { ReportController } from '../controllers/report.controller';
import { validateRequest } from '../middleware/validate';
import { createReportValidator, updateReportValidator } from '../validators/report.validator';

const router = Router();
const controller = new ReportController();

/**
 * @openapi
 * /api/reports:
 *   get:
 *     tags:
 *       - Reports
 *     summary: List all reports
 *     description: Retrieves the complete registry logs of compiled compliance, density, alarm, and safety incidents reports.
 *     responses:
 *       200:
 *         description: List of reports retrieved successfully
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
 *                   example: "Reports retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Report'
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/reports/{id}:
 *   get:
 *     tags:
 *       - Reports
 *     summary: Get a report by ID
 *     description: Retrieves detailed attributes of a single compiled report document.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique Mongo ID identifier of the report
 *         schema:
 *           type: string
 *           example: "60d5ec49f3183c26883e002f"
 *     responses:
 *       200:
 *         description: Report details retrieved successfully
 *       404:
 *         description: Report not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/reports:
 *   post:
 *     tags:
 *       - Reports
 *     summary: Compile/Create a new report
 *     description: Generates a new report record in the system database. Formats dates and assigns sizes automatically if omitted.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               reportId:
 *                 type: string
 *                 example: "REP-105"
 *               name:
 *                 type: string
 *                 example: "Sector B Incident Audit Report"
 *               format:
 *                 type: string
 *                 enum: [PDF, Excel, CSV]
 *                 example: "PDF"
 *               type:
 *                 type: string
 *                 enum: [density, incidents, alarms, compliance]
 *                 example: "incidents"
 *               range:
 *                 type: string
 *                 enum: [today, week, month]
 *                 example: "week"
 *               venueId:
 *                 type: string
 *                 example: "60d5ec49f3183c26883e002a"
 *     responses:
 *       201:
 *         description: Report compiled successfully
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
 *                   example: "Report generated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Report'
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Venue not found
 */
router.post('/', validateRequest(createReportValidator), controller.create);

/**
 * @openapi
 * /api/reports/{id}:
 *   put:
 *     tags:
 *       - Reports
 *     summary: Update report details
 *     description: Modifies parameters of an existing report registry document.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique Mongo ID identifier of the report
 *         schema:
 *           type: string
 *           example: "60d5ec49f3183c26883e002f"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Sector B Incident Audit Final Report"
 *     responses:
 *       200:
 *         description: Report updated successfully
 *       404:
 *         description: Report not found
 */
router.put('/:id', validateRequest(updateReportValidator), controller.update);

/**
 * @openapi
 * /api/reports/{id}:
 *   delete:
 *     tags:
 *       - Reports
 *     summary: Delete a report log
 *     description: Permanently removes a report document registry log from the database.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique Mongo ID identifier of the report
 *         schema:
 *           type: string
 *           example: "60d5ec49f3183c26883e002f"
 *     responses:
 *       200:
 *         description: Report deleted successfully
 *       404:
 *         description: Report not found
 */
router.delete('/:id', controller.delete);

export default router;
