import express from 'express';
import { createInvoice, getInvoices, getInvoiceById, updateInvoice, deleteInvoice } from '../controller/invoiceController.js';
import protect from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route("/").post(protect, createInvoice).get(protect, getInvoices);

router.route("/:id").get(protect, getInvoiceById).put(protect, updateInvoice).delete(protect, deleteInvoice);

export default router;

