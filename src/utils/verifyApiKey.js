// src/utils/verifyApiKey.js
const verifyApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    next();
};

export default verifyApiKey;
