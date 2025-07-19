import { exiftool } from 'exiftool-vendored';

export const getPdfMetadata = async (file) => {
  const metadata = await exiftool.read(file.path);

  return {
    fileName: file.originalname,
    filePath: file.path,
    createdAt: metadata.CreateDate || null,
    modifiedAt: metadata.ModifyDate || null,
    creator: metadata.Creator || metadata.Producer || metadata.Software || 'Unknown',
    pdfVersion: metadata.PDFVersion || 'Unknown'
  };
};
