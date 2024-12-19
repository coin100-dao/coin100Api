// src/models/index.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Sequelize from 'sequelize';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

// Load environment variables from .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);

// Determine host based on PSQL_HOST
const isRemote = process.env.PSQL_HOST === 'remote';
const host = isRemote ? process.env.DB_HOST_REMOTE : process.env.DB_HOST_LOCAL;

// Initialize Sequelize
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host,
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        dialectOptions: process.env.DB_SSL === 'true' ? { ssl: { require: true, rejectUnauthorized: false } } : {},
        logging: process.env.DB_LOGGING === 'true' ? logger.info : false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

const db = {};

// Dynamically import all model files
const files = fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  });

for (const file of files) {
  const modulePath = path.join(__dirname, file);
  const moduleUrl = `file://${modulePath}`;
  const module = await import(moduleUrl);
  const model = module.default;
  if (model && typeof model === 'function') {
    const instance = model(sequelize, Sequelize.DataTypes);
    db[instance.name] = instance;
  }
}

// Associate models if associations exist
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Function to initialize the database
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');

    // Sync all models with the database
    await sequelize.sync();
    logger.info('All models were synchronized successfully.');

    return true;
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    throw error;
  }
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export { initializeDatabase };
export default db;
