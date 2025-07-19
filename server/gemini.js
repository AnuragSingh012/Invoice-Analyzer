import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY in .env");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeInvoiceData(pdfInfo, pdfText) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `You are a financial document analyzer AI.

Below is an invoice PDF's metadata and extracted text. Your job is to extract the following information strictly in JSON format and check the authenticity of the invoice:

Rules for authenticity:
1. If \`createdAt\` and \`modifiedAt\` timestamps are the same and not null, the file is likely authentic.
2. If the metadata \`creator\` is a tool like "iLovePDF", "PDF Editor", or "screenshot tool", the file is likely not authentic.
3. If text and metadata both include matching \`Date of Spend\` or merchant info, it's more likely to be authentic.
4. If \`createdAt\` is null, it's suspicious.
5. If invoice content looks edited or fake, mark it as false.

Now analyze the invoice:

---
PDF Metadata:
${JSON.stringify(pdfInfo, null, 2)}

PDF Text:
${pdfText}

---
Only return the final answer in this exact JSON format with **clear, human-readable explanations in the 'reason'** field, suitable for showing to a non-technical user. Output should look like:


{
  "merchantName": "...",
  "totalAmount": "...",
  "dateOfSpend": "...",
  "isAuthentic": true,
  "reason": "..."
}`
  });

  const cleaned = response.text.trim()
  .replace(/^```json/, '')
  .replace(/^```/, '')
  .replace(/```$/, '')
  .trim();

return JSON.parse(cleaned);
}

