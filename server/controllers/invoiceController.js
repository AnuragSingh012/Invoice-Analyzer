import fs from 'fs';
import { getPdfMetadata } from '../utils/metadataUtils.js';
import { extractPdfText } from '../utils/pdfUtils.js';
import { analyzeInvoiceData } from '../services/geminiService.js';

export const uploadInvoiceHandler = async (req, res) => {
  const filePath = req?.file?.path;

  try {
    if (!filePath) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const metadata = await getPdfMetadata(req.file);
    const pdfText = await extractPdfText(filePath);

    const aiResult = await analyzeInvoiceData(metadata, pdfText);

    res.status(200).json({
      message: 'File processed',
      metadata,
      pdfText,
      aiAnalysis: aiResult
    });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (filePath) {
      fs.unlink(filePath, (err) => {
        if (err) console.error('Failed to clean up file:', err);
      });
    }
  }
};
