// src/services/DatabaseManager.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

// Load environment variables from .env
dotenv.config();

class DatabaseManager {
    constructor() {
        const env = process.env.NODE_ENV || 'development';
        const isRemote = process.env.PSQL_HOST === 'remote';
        const host = isRemote ? process.env.DB_HOST_REMOTE : process.env.DB_HOST_LOCAL;
        const username = process.env.DB_USER;
        const password = process.env.DB_PASSWORD;
        const database = process.env.DB_NAME;
        const port = process.env.DB_PORT || 5432;
        const dialect = 'postgres';
        const dialectOptions = process.env.DB_SSL === 'true' ? { ssl: { require: true, rejectUnauthorized: false } } : {};
        const logging = process.env.DB_LOGGING === 'true' ? console.log : false;

        this.sequelize = new Sequelize(database, username, password, {
            host,
            port,
            dialect,
            dialectOptions,
            logging,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        });
    }

    async connect() {
        try {
            await this.sequelize.authenticate();
            logger.info('Database connection has been established successfully.');
            return true;
        } catch (error) {
            logger.error('Unable to connect to the database:', error);
            return false;
        }
    }

    async disconnect() {
        try {
            await this.sequelize.close();
            logger.info('Database connection closed.');
        } catch (error) {
            logger.error('Error closing database connection:', error);
        }
    }

    getSequelize() {
        return this.sequelize;
    }
}

export default new DatabaseManager();
