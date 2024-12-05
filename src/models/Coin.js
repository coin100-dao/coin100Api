// src/models/Coin.js
const { DataTypes } = require('sequelize');
const databaseManager = require('../services/DatabaseManager');

const Coin = databaseManager.sequelize.define('Coin', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    symbol: {
        type: DataTypes.STRING
    },
    name: {
        type: DataTypes.STRING
    },
    image: {
        type: DataTypes.STRING
    },
    currentPrice: {
        type: DataTypes.FLOAT,
        field: 'current_price'
    },
    marketCap: {
        type: DataTypes.BIGINT,
        field: 'market_cap'
    },
    marketCapRank: {
        type: DataTypes.INTEGER,
        field: 'market_cap_rank'
    },
    fullyDilutedValuation: {
        type: DataTypes.BIGINT,
        field: 'fully_diluted_valuation'
    },
    totalVolume: {
        type: DataTypes.BIGINT,
        field: 'total_volume'
    },
    high24h: {
        type: DataTypes.FLOAT,
        field: 'high_24h'
    },
    low24h: {
        type: DataTypes.FLOAT,
        field: 'low_24h'
    },
    priceChange24h: {
        type: DataTypes.FLOAT,
        field: 'price_change_24h'
    },
    priceChangePercentage24h: {
        type: DataTypes.FLOAT,
        field: 'price_change_percentage_24h'
    },
    marketCapChange24h: {
        type: DataTypes.BIGINT,
        field: 'market_cap_change_24h'
    },
    marketCapChangePercentage24h: {
        type: DataTypes.FLOAT,
        field: 'market_cap_change_percentage_24h'
    },
    circulatingSupply: {
        type: DataTypes.FLOAT,
        field: 'circulating_supply'
    },
    totalSupply: {
        type: DataTypes.FLOAT,
        field: 'total_supply'
    },
    maxSupply: {
        type: DataTypes.FLOAT,
        field: 'max_supply'
    },
    ath: {
        type: DataTypes.FLOAT
    },
    athChangePercentage: {
        type: DataTypes.FLOAT,
        field: 'ath_change_percentage'
    },
    athDate: {
        type: DataTypes.DATE,
        field: 'ath_date'
    },
    atl: {
        type: DataTypes.FLOAT
    },
    atlChangePercentage: {
        type: DataTypes.FLOAT,
        field: 'atl_change_percentage'
    },
    atlDate: {
        type: DataTypes.DATE,
        field: 'atl_date'
    },
    lastUpdated: {
        type: DataTypes.DATE,
        field: 'last_updated'
    },
    currency: {
        type: DataTypes.STRING,
        defaultValue: 'usd'
    }
}, {
    tableName: 'coins',
    timestamps: true
});

module.exports = Coin;
