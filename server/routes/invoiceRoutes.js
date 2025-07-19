import express from 'express';
import { uploadInvoiceHandler } from '../controllers/invoiceController.js';

const router = express.Router();

router.post('/upload', uploadInvoiceHandler);

export default router;
