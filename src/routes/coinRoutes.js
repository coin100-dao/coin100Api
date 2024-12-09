import express from 'express';
import { getCoinsData, getCoinData, getTotalMarketCap } from '../controllers/coinController.js';

const router = express.Router();

/**
 * @route GET /api/coins
 * @description Get data for all coins
 * @query {string} start - Start date in ISO format (optional)
 * @query {string} end - End date in ISO format (optional)
 * @returns {Object} Coins data
 */
router.get('/', getCoinsData);

/**
 * @route GET /api/coins/market/total
 * @description Get total market cap for top 100 coins
 * @query {string} start - Start date in ISO format (optional)
 * @query {string} end - End date in ISO format (optional)
 * @returns {Object} Total market cap data
 */
router.get('/market/total', getTotalMarketCap);

/**
 * @route GET /api/coins/symbol/:symbol
 * @description Get data for a specific coin
 * @param {string} symbol - Coin symbol (e.g., btc, eth)
 * @query {string} start - Start date in ISO format (optional)
 * @query {string} end - End date in ISO format (optional)
 * @returns {Object} Coin data
 */
router.get('/symbol/:symbol', getCoinData);

export default router;
