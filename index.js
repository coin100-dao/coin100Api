import express from 'express';
import dotenv from 'dotenv';
import logger from './src/utils/logger.js';
import { initializeDatabase } from './src/models/index.js';
import { initializeScheduler } from './src/utils/scheduler.js';
import { verifyApiKey } from './src/utils/verifyApiKey.js';
import coinRoutes from './src/routes/coinRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// CORS middleware
app.use((req, res, next) => {
    logger.info('Incoming request:', {
        origin: req.headers.origin,
        path: req.path,
        method: req.method,
        query: req.query
    });

    const allowedOrigins = ['https://coin100.link'];
    
    // Add localhost to allowed origins in development
    if (process.env.NODE_ENV === 'development') {
        allowedOrigins.push('http://localhost:5173');
    }

    const origin = req.headers.origin;
    
    // Allow any of the permitted origins
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        logger.info('CORS allowed for origin:', origin);
    } else {
        logger.warn('CORS blocked for origin:', origin);
    }

    // Required for credentials
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    // Allow all necessary headers
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-api-key');
    
    // Allow all necessary methods
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    next();
});

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
let server;
const startServer = async () => {
    try {
        // Initialize database
        await initializeDatabase();
        logger.info('Database initialization completed');

        // Initialize scheduler in non-test environment
        if (process.env.NODE_ENV !== 'test') {
            logger.info('Initializing scheduled tasks...');
            await initializeScheduler();
            logger.info('Scheduler initialization completed');
        }

        // Get port from environment variable or use default
        const port = process.env.PORT || 5555;

        // Start server
        server = app.listen(port, () => {
            logger.info(`Server is running on port ${port}`);
        });

        // Handle server errors
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                logger.error(`Port ${port} is already in use`);
                process.exit(1);
            } else {
                logger.error('Server error:', error);
            }
        });

        return server;
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle server shutdown
process.on('SIGTERM', () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed');
            process.exit(0);
        });
    }
});

if (process.env.NODE_ENV !== 'test') {
    startServer();
}

export { app, server, startServer };
