import { Op } from 'sequelize';
import db from '../models/index.js';
import logger from '../utils/logger.js';
import { periodToMilliseconds, isValidPeriod } from '../utils/timeUtils.js';

/**
 * Get Coins data for all coins within specified time period
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getCoinsData(req, res) {
    try {
        const { period } = req.query;
        logger.info('Fetching coins data with period:', { period });
        
        // Validate period format if provided
        if (period && !isValidPeriod(period)) {
            logger.warn('Invalid period format:', { period });
            return res.status(400).json({
                success: false,
                error: 'Invalid period format. Use format: [number][m/h/d/w/y] (e.g., 5m, 1h, 1d)'
            });
        }

        // Calculate time threshold
        const timeThreshold = period ? new Date(Date.now() - periodToMilliseconds(period)) : new Date(Date.now() - periodToMilliseconds('5m'));
        logger.info('Time threshold:', { timeThreshold: timeThreshold.toISOString() });

        // First try to get records within the time threshold
        const results = await db.Coin.findAll({
            where: {
                last_updated: {
                    [Op.gte]: timeThreshold
                }
            },
            order: [['market_cap_rank', 'ASC']],
            logging: console.log
        });

        // If no results found within threshold, get the most recent data
        if (results.length === 0) {
            logger.info('No data found within time threshold, fetching most recent data');
            const mostRecentResults = await db.Coin.findAll({
                order: [
                    ['last_updated', 'DESC'],
                    ['market_cap_rank', 'ASC']
                ],
                logging: console.log
            });

            if (mostRecentResults.length === 0) {
                logger.warn('No coins found in database');
                return res.status(404).json({
                    success: false,
                    error: 'No coin data available'
                });
            }

            logger.info(`Retrieved ${mostRecentResults.length} coins (most recent data)`);
            return res.json({
                success: true,
                period: period || '5m',
                count: mostRecentResults.length,
                data: mostRecentResults
            });
        }

        logger.info(`Retrieved ${results.length} coins for period: ${period || '5m'}`);
        
        res.status(200).json({
            success: true,
            period: period || '5m',
            count: results.length,
            data: results
        });
    } catch (error) {
        logger.error('Error in getCoinsData:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

/**
 * Get data for a specific coin within specified time period
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getCoinData(req, res) {
    try {
        const { symbol, period } = req.query;
        logger.info('Fetching coin data:', { symbol, period });

        if (!symbol) {
            logger.warn('No symbol provided');
            return res.status(400).json({
                success: false,
                error: 'Symbol is required'
            });
        }

        // Validate period format if provided
        if (period && !isValidPeriod(period)) {
            logger.warn('Invalid period format:', { period });
            return res.status(400).json({
                success: false,
                error: 'Invalid period format. Use format: [number][m/h/d/w/y] (e.g., 5m, 1h, 1d)'
            });
        }

        // Calculate time threshold
        const timeThreshold = period ? new Date(Date.now() - periodToMilliseconds(period)) : new Date(Date.now() - periodToMilliseconds('5m'));
        logger.info('Time threshold:', { timeThreshold: timeThreshold.toISOString() });

        // Query for the coin data
        logger.info('Querying database for coin:', { symbol: symbol.toLowerCase() });
        const result = await db.Coin.findOne({
            where: {
                symbol: symbol.toLowerCase(),
                last_updated: {
                    [Op.gte]: timeThreshold
                }
            },
            order: [['last_updated', 'DESC']],
            logging: console.log
        });

        if (!result) {
            logger.warn('No data found for symbol:', { symbol });
            return res.status(404).json({
                success: false,
                error: `No data found for symbol: ${symbol}`
            });
        }

        logger.info('Found coin data:', { symbol, lastUpdated: result.last_updated });

        res.status(200).json({
            success: true,
            symbol,
            period: period || '5m',
            count: 1,
            data: [result]
        });
    } catch (error) {
        logger.error('Error in getCoinData:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

export { getCoinsData, getCoinData };
