import express from 'express';

import { parseInvoiceFromText, generateReminder, getDashboardSummary } from '../controller/aiController.js';

import protect from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/parse-text", protect, parseInvoiceFromText);
router.post("/generate-reminder", protect, generateReminder);
router.get("/dashboard-summary", protect, getDashboardSummary);

export default router;