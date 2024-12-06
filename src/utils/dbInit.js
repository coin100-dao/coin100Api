import db from '../models/index.js';
import logger from './logger.js';

const initializeDatabase = async () => {
    try {
        // Test database connection
        await db.sequelize.authenticate();
        logger.info('Database connection has been established successfully.');

        // Sync database models
        await db.sequelize.sync();
        logger.info('Database models synchronized successfully.');

        return true;
    } catch (error) {
        logger.error('Database initialization failed:', { error: error.message, stack: error.stack });
        throw error;
    }
};

export default initializeDatabase;
