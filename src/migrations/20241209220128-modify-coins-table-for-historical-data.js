'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  try {
    // First check if last_updated column exists, if not create it
    await queryInterface.addColumn('coins', 'last_updated', {
      type: Sequelize.DATE,
      allowNull: true
    });
  } catch (error) {
    // Column might already exist, continue
    console.log('last_updated column might already exist:', error.message);
  }

  // Remove the primary key constraint
  try {
    await queryInterface.removeConstraint('coins', 'coins_pkey');
  } catch (error) {
    console.log('Primary key constraint might not exist:', error.message);
  }

  // Add last_updated to the primary key
  await queryInterface.addConstraint('coins', {
    fields: ['id', 'last_updated'],
    type: 'primary key',
    name: 'coins_pkey_with_timestamp'
  });

  // Add index on symbol and last_updated for faster queries
  await queryInterface.addIndex('coins', {
    fields: ['symbol', 'last_updated'],
    name: 'coins_symbol_last_updated_idx'
  });
}

export async function down(queryInterface, Sequelize) {
  // Remove the new primary key constraint
  await queryInterface.removeConstraint('coins', 'coins_pkey_with_timestamp');

  // Remove the new index
  await queryInterface.removeIndex('coins', 'coins_symbol_last_updated_idx');

  // Restore the original primary key
  await queryInterface.addConstraint('coins', {
    fields: ['id'],
    type: 'primary key',
    name: 'coins_pkey'
  });
}
