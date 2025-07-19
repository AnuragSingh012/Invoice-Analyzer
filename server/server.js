import express from 'express';
import multer from 'multer';
import { exiftool } from 'exiftool-vendored';
import pdf from 'pdf-parse/lib/pdf-parse.js';
import fs from 'fs';
import cors from 'cors';
import { analyzeInvoiceData } from './gemini.js';


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

app.post('/api/invoice/upload', upload.single('invoice'), async (req, res) => {
  const filePath = req?.file?.path;

  try {
    if (!filePath) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const metadata = await exiftool.read(filePath);

    const pdfInfo = {
      fileName: req.file.originalname,
      filePath,
      createdAt: metadata.CreateDate || null,
      modifiedAt: metadata.ModifyDate || null,
      creator: metadata.Creator || metadata.Producer || metadata.Software || 'Unknown',
      pdfVersion: metadata.PDFVersion || 'Unknown'
    };

    let pdfText = '';
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdf(dataBuffer);
      pdfText = pdfData.text;
    } catch (pdfErr) {
      console.warn('PDF parsing failed:', pdfErr.message);
      pdfText = '[Text extraction failed or file not valid PDF]';
    }


    const aiResponse = await analyzeInvoiceData(pdfInfo, pdfText);

    const aiResult = await analyzeInvoiceData(pdfInfo, pdfText);

    res.status(200).json({
      message: 'File processed',
      metadata: pdfInfo,
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
});



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
