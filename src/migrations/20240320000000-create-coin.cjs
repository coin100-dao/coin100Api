module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Coins', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
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
      current_price: {
        type: Sequelize.FLOAT
      },
      market_cap: {
        type: Sequelize.BIGINT
      },
      market_cap_rank: {
        type: Sequelize.INTEGER
      },
      fully_diluted_valuation: {
        type: Sequelize.BIGINT
      },
      total_volume: {
        type: Sequelize.BIGINT
      },
      high_24h: {
        type: Sequelize.FLOAT
      },
      low_24h: {
        type: Sequelize.FLOAT
      },
      price_change_24h: {
        type: Sequelize.FLOAT
      },
      price_change_percentage_24h: {
        type: Sequelize.FLOAT
      },
      market_cap_change_24h: {
        type: Sequelize.BIGINT
      },
      market_cap_change_percentage_24h: {
        type: Sequelize.FLOAT
      },
      circulating_supply: {
        type: Sequelize.FLOAT
      },
      total_supply: {
        type: Sequelize.FLOAT
      },
      max_supply: {
        type: Sequelize.FLOAT
      },
      ath: {
        type: Sequelize.FLOAT
      },
      ath_change_percentage: {
        type: Sequelize.FLOAT
      },
      ath_date: {
        type: Sequelize.DATE
      },
      atl: {
        type: Sequelize.FLOAT
      },
      atl_change_percentage: {
        type: Sequelize.FLOAT
      },
      atl_date: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Coins');
  }
};
