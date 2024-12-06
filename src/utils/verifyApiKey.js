// src/utils/verifyApiKey.js
const verifyApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    console.log('Received API Key:', apiKey);
    console.log('Expected API Key:', process.env.COIN100_API_KEY);
    if (!apiKey) {
        return res.status(401).json({ message: 'API key is required' });
    }
    if (apiKey !== process.env.COIN100_API_KEY) {
        return res.status(403).json({ message: 'Invalid API key' });
    }
    next();
};

export default verifyApiKey;
