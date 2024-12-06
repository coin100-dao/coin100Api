'use strict';

/** @type {import('sequelize-cli').Migration} */
const migration = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('coins', 'current_price', {
      type: Sequelize.DECIMAL(20, 8)
    });
    await queryInterface.changeColumn('coins', 'market_cap', {
      type: Sequelize.DECIMAL(20, 0)
    });
    await queryInterface.changeColumn('coins', 'fully_diluted_valuation', {
      type: Sequelize.DECIMAL(20, 0)
    });
    await queryInterface.changeColumn('coins', 'total_volume', {
      type: Sequelize.DECIMAL(20, 0)
    });
    await queryInterface.changeColumn('coins', 'high_24h', {
      type: Sequelize.DECIMAL(20, 8)
    });
    await queryInterface.changeColumn('coins', 'low_24h', {
      type: Sequelize.DECIMAL(20, 8)
    });
    await queryInterface.changeColumn('coins', 'price_change_24h', {
      type: Sequelize.DECIMAL(20, 8)
    });
    await queryInterface.changeColumn('coins', 'price_change_percentage_24h', {
      type: Sequelize.DECIMAL(10, 2)
    });
    await queryInterface.changeColumn('coins', 'market_cap_change_24h', {
      type: Sequelize.DECIMAL(20, 0)
    });
    await queryInterface.changeColumn('coins', 'market_cap_change_percentage_24h', {
      type: Sequelize.DECIMAL(10, 2)
    });
    await queryInterface.changeColumn('coins', 'circulating_supply', {
      type: Sequelize.DECIMAL(20, 0)
    });
    await queryInterface.changeColumn('coins', 'total_supply', {
      type: Sequelize.DECIMAL(20, 0)
    });
    await queryInterface.changeColumn('coins', 'max_supply', {
      type: Sequelize.DECIMAL(20, 0)
    });
    await queryInterface.changeColumn('coins', 'ath', {
      type: Sequelize.DECIMAL(20, 8)
    });
    await queryInterface.changeColumn('coins', 'ath_change_percentage', {
      type: Sequelize.DECIMAL(10, 2)
    });
    await queryInterface.changeColumn('coins', 'atl', {
      type: Sequelize.DECIMAL(20, 8)
    });
    await queryInterface.changeColumn('coins', 'atl_change_percentage', {
      type: Sequelize.DECIMAL(10, 2)
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('coins', 'current_price', {
      type: Sequelize.FLOAT
    });
    await queryInterface.changeColumn('coins', 'market_cap', {
      type: Sequelize.BIGINT
    });
    await queryInterface.changeColumn('coins', 'fully_diluted_valuation', {
      type: Sequelize.BIGINT
    });
    await queryInterface.changeColumn('coins', 'total_volume', {
      type: Sequelize.BIGINT
    });
    await queryInterface.changeColumn('coins', 'high_24h', {
      type: Sequelize.FLOAT
    });
    await queryInterface.changeColumn('coins', 'low_24h', {
      type: Sequelize.FLOAT
    });
    await queryInterface.changeColumn('coins', 'price_change_24h', {
      type: Sequelize.FLOAT
    });
    await queryInterface.changeColumn('coins', 'price_change_percentage_24h', {
      type: Sequelize.FLOAT
    });
    await queryInterface.changeColumn('coins', 'market_cap_change_24h', {
      type: Sequelize.BIGINT
    });
    await queryInterface.changeColumn('coins', 'market_cap_change_percentage_24h', {
      type: Sequelize.FLOAT
    });
    await queryInterface.changeColumn('coins', 'circulating_supply', {
      type: Sequelize.FLOAT
    });
    await queryInterface.changeColumn('coins', 'total_supply', {
      type: Sequelize.FLOAT
    });
    await queryInterface.changeColumn('coins', 'max_supply', {
      type: Sequelize.FLOAT
    });
    await queryInterface.changeColumn('coins', 'ath', {
      type: Sequelize.FLOAT
    });
    await queryInterface.changeColumn('coins', 'ath_change_percentage', {
      type: Sequelize.FLOAT
    });
    await queryInterface.changeColumn('coins', 'atl', {
      type: Sequelize.FLOAT
    });
    await queryInterface.changeColumn('coins', 'atl_change_percentage', {
      type: Sequelize.FLOAT
    });
  }
};

export default migration;
