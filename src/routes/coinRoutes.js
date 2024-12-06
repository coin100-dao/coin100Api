import express from 'express';
import { getCoinsData, getCoinData } from '../controllers/coinController.js';

const router = express.Router();

/**
 * @route GET /api/coins
 * @description Get data for all coins within specified time period
 * @param {string} period - Optional time period (e.g., 5m, 1h, 1d)
 * @returns {Object} Coins data
 */
router.get('/', getCoinsData);

/**
 * @route GET /api/coins/:symbol
 * @description Get data for a specific coin within specified time period
 * @param {string} symbol - Coin symbol (required)
 * @param {string} period - Optional time period (e.g., 5m, 1h, 1d)
 * @returns {Object} Coin data
 */
router.get('/:symbol', getCoinData);

export default router;
