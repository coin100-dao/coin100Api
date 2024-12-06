import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import logger from './src/utils/logger.js';
import initializeDatabase from './src/utils/dbInit.js';
import initializeScheduler from './src/utils/scheduler.js';
import verifyApiKey from './src/utils/verifyApiKey.js';
import coinRoutes from './src/routes/coinRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5555;

// Middleware
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

// Apply API key verification to all /api routes
app.use('/api', verifyApiKey);

// Routes
app.use('/api/coins', coinRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Unhandled error:', { error: err.message, stack: err.stack });
    res.status(500).json({
        success: false,
        error: 'Internal Server Error'
    });
});

// Handle 404 routes
app.use((req, res) => {
    logger.warn(`404 Not Found: ${req.method} ${req.url}`);
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Initialize application
const startServer = async () => {
    try {
        // Initialize database
        await initializeDatabase();

        // Start server
        app.listen(port, () => {
            logger.info(`Server is running on port ${port}`);
            
            // Initialize scheduler after server starts
            initializeScheduler();
        });
    } catch (error) {
        logger.error('Failed to start server:', { error: error.message, stack: error.stack });
        process.exit(1);
    }
};

startServer();
