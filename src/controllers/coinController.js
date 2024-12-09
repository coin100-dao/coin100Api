import { Op } from 'sequelize';
import db from '../models/index.js';
import logger from '../utils/logger.js';

/**
 * Get Coins data for all coins within specified date range
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getCoinsData(req, res) {
    try {
        const { start, end } = req.query;
        logger.info('Fetching coins data with date range:', { start, end });
        
        let startDate = start ? new Date(start) : new Date(Date.now() - 5 * 60 * 1000); // Default to last 5 minutes
        let endDate = end ? new Date(end) : new Date();

        // Validate dates
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            logger.warn('Invalid date format provided:', { start, end });
            return res.status(400).json({
                success: false,
                error: 'Invalid date format. Use ISO 8601 format (e.g., 2024-01-01T00:00:00Z)'
            });
        }

        // First try to get records within the date range
        const results = await db.Coin.findAll({
            where: {
                last_updated: {
                    [Op.between]: [startDate, endDate]
                }
            },
            order: [['market_cap_rank', 'ASC']],
            logging: console.log
        });

        // If no results found within range, get the most recent data
        if (results.length === 0) {
            logger.info('No data found within date range, fetching most recent data');
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
                dateRange: {
                    start: startDate.toISOString(),
                    end: endDate.toISOString()
                },
                count: mostRecentResults.length,
                data: mostRecentResults
            });
        }

        logger.info(`Retrieved ${results.length} coins for date range`);
        
        res.status(200).json({
            success: true,
            dateRange: {
                start: startDate.toISOString(),
                end: endDate.toISOString()
            },
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
 * Get data for a specific coin within specified date range
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getCoinData(req, res) {
    try {
        const { symbol } = req.params;
        const { start, end } = req.query;
        logger.info('Fetching coin data:', { symbol, start, end });

        if (!symbol) {
            logger.warn('No symbol provided');
            return res.status(400).json({
                success: false,
                error: 'Symbol is required'
            });
        }

        let startDate = start ? new Date(start) : new Date(Date.now() - 5 * 60 * 1000); // Default to last 5 minutes
        let endDate = end ? new Date(end) : new Date();

        // Validate dates
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            logger.warn('Invalid date format provided:', { start, end });
            return res.status(400).json({
                success: false,
                error: 'Invalid date format. Use ISO 8601 format (e.g., 2024-01-01T00:00:00Z)'
            });
        }

        // First try to get records within the date range
        const results = await db.Coin.findAll({
            where: {
                symbol: symbol.toLowerCase(),
                last_updated: {
                    [Op.between]: [startDate, endDate]
                }
            },
            order: [['last_updated', 'ASC']]
        });

        // If no results found within range, get the most recent data for this symbol
        if (results.length === 0) {
            const mostRecentResults = await db.Coin.findAll({
                where: {
                    symbol: symbol.toLowerCase()
                },
                order: [['last_updated', 'DESC']],
                limit: 1
            });

            if (mostRecentResults.length === 0) {
                logger.info('No data found for symbol:', symbol);
                return res.status(404).json({
                    success: false,
                    error: 'No data found for the specified coin'
                });
            }

            logger.info('Retrieved most recent data for symbol:', symbol);
            return res.json({
                success: true,
                dateRange: {
                    start: mostRecentResults[0].last_updated,
                    end: mostRecentResults[0].last_updated
                },
                data: mostRecentResults
            });
        }

        logger.info(`Retrieved ${results.length} records for symbol:`, symbol);
        res.json({
            success: true,
            dateRange: {
                start: startDate.toISOString(),
                end: endDate.toISOString()
            },
            data: results
        });
    } catch (error) {
        logger.error('Error in getCoinData:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}

/**
 * Get total market cap data within specified date range
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getTotalMarketCap(req, res) {
    try {
        const { start, end } = req.query;
        
        let startDate = start ? new Date(start) : new Date(Date.now() - 5 * 60 * 1000); // Default to last 5 minutes
        let endDate = end ? new Date(end) : new Date();

        // Validate dates
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            logger.warn('Invalid date format provided:', { start, end });
            return res.status(400).json({
                success: false,
                error: 'Invalid date format. Use ISO 8601 format (e.g., 2024-01-01T00:00:00Z)'
            });
        }

        const totalMarketCapData = await db.TotalTop100Cap.findAll({
            where: {
                timestamp: {
                    [Op.between]: [startDate, endDate]
                }
            },
            order: [['timestamp', 'ASC']],
            attributes: ['timestamp', 'total_market_cap']
        });

        res.json({
            success: true,
            dateRange: {
                start: startDate.toISOString(),
                end: endDate.toISOString()
            },
            data: totalMarketCapData
        });
    } catch (error) {
        console.error('Error fetching total market cap:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch total market cap data'
        });
    }
}

export { getCoinsData, getCoinData, getTotalMarketCap };
