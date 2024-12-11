import express from 'express';
import { executeRebase, getRebaseMetrics } from '../controllers/coin100Controller.js';

const router = express.Router();

/**
 * @route POST /api/rebase/execute
 * @description Execute a rebase operation with the provided market cap
 * @body {Object} request body
 * @body {string} request.newMarketCap - New market cap value to rebase to
 * @body {string} request.walletAddress - Address of the wallet executing the rebase
 * @returns {Object} Transaction data for MetaMask
 */
router.post('/execute', executeRebase);

/**
 * @route GET /api/rebase/metrics
 * @description Get current rebase metrics including total supply and last market cap
 * @returns {Object} Current rebase metrics
 */
router.get('/metrics', getRebaseMetrics);

export default router;
