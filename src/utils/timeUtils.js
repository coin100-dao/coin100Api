import logger from './logger.js';

/**
 * Convert time period string to milliseconds
 * @param {string} period - Time period (e.g., '5m', '1h', '1d', '1y')
 * @returns {number} Milliseconds
 */
export const periodToMilliseconds = (period) => {
    if (!period) return 5 * 60 * 1000; // Default 5 minutes

    const value = parseInt(period);
    const unit = period.slice(-1).toLowerCase();

    switch (unit) {
        case 'm':
            return value * 60 * 1000;
        case 'h':
            return value * 60 * 60 * 1000;
        case 'd':
            return value * 24 * 60 * 60 * 1000;
        case 'w':
            return value * 7 * 24 * 60 * 60 * 1000;
        case 'y':
            return value * 365 * 24 * 60 * 60 * 1000;
        default:
            logger.warn(`Invalid period format: ${period}, using default of 5m`);
            return 5 * 60 * 1000;
    }
};

/**
 * Validate period format
 * @param {string} period - Time period to validate
 * @returns {boolean} Is valid period
 */
export const isValidPeriod = (period) => {
    if (!period) return true; // Default period is valid
    return /^\d+[mhdwy]$/i.test(period);
};
