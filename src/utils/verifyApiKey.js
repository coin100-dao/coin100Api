// src/utils/verifyApiKey.js
import logger from './logger.js';

function verifyApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
        logger.apiRequest(req, 401, 'Missing API key');
        return res.status(401).json({ message: 'API key is required' });
    }
    
    if (apiKey !== process.env.COIN100_API_KEY) {
        logger.apiRequest(req, 403, 'Invalid API key');
        return res.status(403).json({ message: 'Invalid API key' });
    }
    
    logger.apiRequest(req, 200, 'Valid API key');
    next();
}

export { verifyApiKey };
