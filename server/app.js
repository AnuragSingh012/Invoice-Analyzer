import express from 'express';
import cors from 'cors';
import multer from 'multer';
import invoiceRoutes from './routes/invoiceRoutes.js';

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('App is running...');
});

app.use('/api/invoice', upload.single('invoice'), invoiceRoutes);

export default app;
