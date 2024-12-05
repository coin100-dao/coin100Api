const { sequelize } = require('../models');

// Controller to handle raw queries on the coin100 table
async function runRawQuery(req, res) {
    const { query } = req.body;
    try {
        const results = await sequelize.query(query);
        res.status(200).json(results);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { runRawQuery };
