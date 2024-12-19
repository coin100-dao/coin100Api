// src/models/index.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

// Load environment variables
dotenv.config();

// Define __filename and __dirname before using them
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine the environment
const env = process.env.NODE_ENV || 'development';

// Resolve the Sequelize configuration
const configPath = path.resolve(__dirname, '../../sequelize.config.js');
const configModule = await import(`file://${configPath}`);
const config = configModule.default;

// Extract the configuration for the current environment
const dbConfig = config[env];

// Initialize Sequelize
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect,
  dialectOptions: dbConfig.dialectOptions,
  logging: dbConfig.logging,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Initialize db object to hold models
const db = {};

// Read all model files and import them
const files = fs.readdirSync(__dirname).filter(file => {
  return (
    file.indexOf('.') !== 0 &&
    file !== path.basename(__filename) &&
    file.slice(-3) === '.js' &&
    file.indexOf('.test.js') === -1
  );
});

for (const file of files) {
  const modelPath = path.join(__dirname, file);
  const modelModule = await import(`file://${modelPath}`);
  const model = modelModule.default;
  if (model && typeof model === 'function') {
    const instance = model(sequelize, Sequelize.DataTypes);
    db[instance.name] = instance;
  }
}

// Handle model associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Function to initialize the database
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');

    // Sync models with the database
    await sequelize.sync();
    logger.info('All models were synchronized successfully.');

    return true;
  } catch (error) {
    logger.error('Database initialization failed:', { error: error.message, stack: error.stack });
    throw error;
  }
};

// Add Sequelize instance and library to db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Export the db object and initializeDatabase function
export { initializeDatabase };
export default db;
