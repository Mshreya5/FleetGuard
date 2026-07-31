require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const { connectDatabase } = require('./config/database');
const serviceRoutes = require('./routes/serviceRoutes');
const serviceExtensionRoutes = require('./routes/serviceExtensionRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/service-center', serviceRoutes);
app.use('/api/service-center/extensions', serviceExtensionRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

async function startServer() {
  try {
    const connected = await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Service Center backend running on port ${PORT}${connected ? '' : ' in demo mode'}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

startServer();
