// src/utils/syncDatabase.js
import databaseManager from '../services/DatabaseManager.js';

(async () => {
  try {
    console.log('Syncing database...');
    await databaseManager.sequelize.sync({ force: true }); // Force recreate all tables
    console.log('Database synced successfully.');
  } catch (error) {
    console.error('Error syncing database:', error);
  } finally {
    process.exit();
  }
})();
