require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Cradle Care API is running' });
});

const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/products');

app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);

app.listen(port, () => {
  console.log(`Cradle Care API running on http://localhost:${port}`);
});
