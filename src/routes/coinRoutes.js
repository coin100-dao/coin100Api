const express = require('express');
const { runRawQuery } = require('../controllers/coinController');

const router = express.Router();

// Route to handle raw queries on the coin100 table
router.post('/coin100/raw-query', runRawQuery);

module.exports = router;
