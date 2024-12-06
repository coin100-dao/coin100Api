// src/services/DatabaseManager.js
import { Sequelize } from 'sequelize';
import { config } from 'dotenv';

config();

class DatabaseManager {
    constructor() {
        const isDevelopment = process.env.ENV === 'development';
        const dbHost = isDevelopment ? process.env.DB_HOST_REMOTE : process.env.DB_HOST_LOCAL;
        
        this.sequelize = new Sequelize(
            process.env.DB_NAME,
            process.env.DB_USER,
            process.env.DB_PASSWORD,
            {
                host: dbHost,
                port: process.env.DB_PORT,
                dialect: 'postgres',
                logging: false, 
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
