import cron from 'node-cron';
import logger from './logger.js';
import fetchAndStoreCoinData from './fetchAndStoreCoinData.js';

async function initializeScheduler() {
    logger.info('Initializing scheduled tasks...');

    // Schedule coin data fetch every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
        logger.info('Running scheduled coin data update...');
        try {
            await fetchAndStoreCoinData();
            logger.info('Scheduled coin data update completed successfully');
        } catch (error) {
            logger.error('Scheduled coin data update failed:', { error: error.message });
        }
    });

    // Perform initial fetch
    logger.info('Performing initial coin data fetch...');
    try {
        await fetchAndStoreCoinData();
        logger.info('Initial coin data fetch completed successfully');
    } catch (error) {
        logger.error('Initial coin data fetch failed:', { error: error.message });
    }
}

export { initializeScheduler };
