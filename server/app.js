import express from 'express';
import cors from 'cors';
import multer from 'multer';
import invoiceRoutes from './routes/invoiceRoutes.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });
app.use('/api/invoice', upload.single('invoice'), invoiceRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
