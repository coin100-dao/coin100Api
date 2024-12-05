// index.js
import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';

config();

const app = express();
const port = process.env.PORT || 5555;

// Middleware to verify API key
const verifyApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
        return res.status(401).json({ 
            success: false, 
            error: 'API key is required' 
        });
    }

    if (apiKey !== process.env.COIN100_API_KEY) {
        return res.status(403).json({ 
            success: false, 
            error: 'Invalid API key' 
        });
    }

    next();
};

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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
