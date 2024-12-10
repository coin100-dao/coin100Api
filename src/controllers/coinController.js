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
        
        let startDate = start ? new Date(start) : new Date(Date.now() - 60 * 60 * 1000); // Default to last 60 minutes
        let endDate = end ? new Date(end) : new Date();

        // Validate dates
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            logger.warn('Invalid date format provided:', { start, end });
            return res.status(400).json({
                success: false,
                error: 'Invalid date format. Use ISO 8601 format (e.g., 2024-01-01T00:00:00Z)'
            });
        }

        const results = await db.Coin.findAll({
            where: {
                last_updated: {
                    [Op.between]: [startDate, endDate]
                }
            },
            order: [
                ['last_updated', 'ASC'],
                ['market_cap_rank', 'ASC']
            ],
            attributes: [
                'symbol',
                'name',
                'current_price',
                'market_cap',
                'market_cap_rank',
                'total_volume',
                'last_updated'
            ]
        });

        if (results.length === 0) {
            logger.info('No data found within specified date range');
            return res.status(404).json({
                success: false,
                error: 'No coin data available for the specified date range'
            });
        }

        logger.info(`Retrieved ${results.length} coin entries for date range`);
        
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

        let startDate = start ? new Date(start) : new Date(Date.now() - 60 * 60 * 1000); // Default to last 60 minutes
        let endDate = end ? new Date(end) : new Date();

        // Validate dates
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            logger.warn('Invalid date format provided:', { start, end });
            return res.status(400).json({
                success: false,
                error: 'Invalid date format. Use ISO 8601 format (e.g., 2024-01-01T00:00:00Z)'
            });
        }

        const results = await db.Coin.findAll({
            where: {
                symbol: symbol.toLowerCase(),
                last_updated: {
                    [Op.between]: [startDate, endDate]
                }
            },
            order: [['last_updated', 'ASC']],
            attributes: [
                'symbol',
                'name',
                'current_price',
                'market_cap',
                'market_cap_rank',
                'total_volume',
                'last_updated'
            ]
        });

        if (results.length === 0) {
            logger.info('No data found for symbol:', symbol);
            return res.status(404).json({
                success: false,
                error: 'No data found for the specified coin in the given date range'
            });
        }

        logger.info(`Retrieved ${results.length} records for symbol:`, symbol);
        res.json({
            success: true,
            dateRange: {
                start: startDate.toISOString(),
                end: endDate.toISOString()
            },
            count: results.length,
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
