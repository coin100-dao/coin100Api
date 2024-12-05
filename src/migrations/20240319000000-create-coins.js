'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('coins', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      symbol: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      currentPrice: {
        type: Sequelize.FLOAT,
        field: 'current_price'
      },
      marketCap: {
        type: Sequelize.BIGINT,
        field: 'market_cap'
      },
      marketCapRank: {
        type: Sequelize.INTEGER,
        field: 'market_cap_rank'
      },
      fullyDilutedValuation: {
        type: Sequelize.BIGINT,
        field: 'fully_diluted_valuation'
      },
      totalVolume: {
        type: Sequelize.BIGINT,
        field: 'total_volume'
      },
      high24h: {
        type: Sequelize.FLOAT,
        field: 'high_24h'
      },
      low24h: {
        type: Sequelize.FLOAT,
        field: 'low_24h'
      },
      priceChange24h: {
        type: Sequelize.FLOAT,
        field: 'price_change_24h'
      },
      priceChangePercentage24h: {
        type: Sequelize.FLOAT,
        field: 'price_change_percentage_24h'
      },
      marketCapChange24h: {
        type: Sequelize.BIGINT,
        field: 'market_cap_change_24h'
      },
      marketCapChangePercentage24h: {
        type: Sequelize.FLOAT,
        field: 'market_cap_change_percentage_24h'
      },
      circulatingSupply: {
        type: Sequelize.FLOAT,
        field: 'circulating_supply'
      },
      totalSupply: {
        type: Sequelize.FLOAT,
        field: 'total_supply'
      },
      maxSupply: {
        type: Sequelize.FLOAT,
        field: 'max_supply'
      },
      ath: {
        type: Sequelize.FLOAT
      },
      athChangePercentage: {
        type: Sequelize.FLOAT,
        field: 'ath_change_percentage'
      },
      athDate: {
        type: Sequelize.DATE,
        field: 'ath_date'
      },
      atl: {
        type: Sequelize.FLOAT
      },
      atlChangePercentage: {
        type: Sequelize.FLOAT,
        field: 'atl_change_percentage'
      },
      atlDate: {
        type: Sequelize.DATE,
        field: 'atl_date'
      },
      lastUpdated: {
        type: Sequelize.DATE,
        field: 'last_updated'
      },
      currency: {
        type: Sequelize.STRING,
        defaultValue: 'usd'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('coins');
  }
};
