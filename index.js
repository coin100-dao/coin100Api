// index.js
import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import cron from 'node-cron';
import fetchAndStoreCoinData from './src/utils/fetchAndStoreCoinData';
import verifyApiKey from './src/utils/verifyApiKey';
import coinRoutes from './src/routes/coinRoutes';

config();

const app = express();
const port = process.env.PORT || 5555;

app.use(cors());
app.use(express.json());

// Public endpoint - no API key required
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Coin100 API is running!',
        version: '1.0.0'
    });
});

// Apply API key protection to all routes under /api
app.use('/api', verifyApiKey);

// Use coinRoutes for /api/coin100
app.use('/api/coin100', coinRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal Server Error'
    });
});

// Handle 404 routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// // Schedule a task to run every minute
// cron.schedule('* * * * *', fetchAndStoreCoinData);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
