import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import Sequelize from 'sequelize';
import process from 'process';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const configFile = process.env.PSQL_HOST === 'remote' ? 'remote-config.json' : 'local-config.json';
const config = require(`../config/${configFile}`)[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

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
  const moduleUrl = 'file://' + modulePath;
  const module = await import(moduleUrl);
  const model = module.default;
  if (model && model.prototype && model.prototype.constructor) {
    const instance = model(sequelize, Sequelize.DataTypes);
    db[instance.name] = instance;
  }
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

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
