// src/services/DatabaseManager.js
import { Sequelize } from 'sequelize';
import localConfig from '../config/local-config.json';
import remoteConfig from '../config/remote-config.json';

class DatabaseManager {
    constructor() {
        const env = process.env.NODE_ENV || 'development';
        const isDevelopment = env === 'development';
        const config = isDevelopment ? remoteConfig[env] : localConfig[env];
        
        this.sequelize = new Sequelize(
            config.database,
            config.username,
            config.password,
            {
                host: config.host,
                port: config.port,
                dialect: config.dialect,
                logging: config.logging,
                dialectOptions: config.dialectOptions,
                pool: {
                    max: 5,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                }
            }
        );
    }

    async connect() {
        try {
            await this.sequelize.authenticate();
            console.log('Database connection has been established successfully.');
            return true;
        } catch (error) {
            console.error('Unable to connect to the database:', error);
            return false;
        }
    }

    async disconnect() {
        try {
            await this.sequelize.close();
            console.log('Database connection closed.');
        } catch (error) {
            console.error('Error closing database connection:', error);
        }
    }

    getSequelize() {
        return this.sequelize;
    }
}

export default new DatabaseManager();
