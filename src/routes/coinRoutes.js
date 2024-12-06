import express from 'express';
import { runRawQuery } from '../controllers/coinController.js';

const router = express.Router();

// Route to handle raw queries on the coin100 table
router.post('/coin100/raw-query', runRawQuery);

export default router;
