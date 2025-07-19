import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';

export const extractPdfText = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);
    return pdfData.text;
  } catch (error) {
    console.warn('PDF parsing failed:', error.message);
    return '[Text extraction failed or file not valid PDF]';
  }
};
