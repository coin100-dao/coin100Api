// src/models/Coin.js
import { DataTypes } from 'sequelize';
import sequelize from '../services/DatabaseManager';

const Coin = sequelize.define('Coin', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    symbol: DataTypes.STRING,
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    current_price: DataTypes.FLOAT,
    market_cap: DataTypes.BIGINT,
    market_cap_rank: DataTypes.INTEGER,
    fully_diluted_valuation: DataTypes.BIGINT,
    total_volume: DataTypes.BIGINT,
    high_24h: DataTypes.FLOAT,
    low_24h: DataTypes.FLOAT,
    price_change_24h: DataTypes.FLOAT,
    price_change_percentage_24h: DataTypes.FLOAT,
    market_cap_change_24h: DataTypes.BIGINT,
    market_cap_change_percentage_24h: DataTypes.FLOAT,
    circulating_supply: DataTypes.FLOAT,
    total_supply: DataTypes.FLOAT,
    max_supply: DataTypes.FLOAT,
    ath: DataTypes.FLOAT,
    ath_change_percentage: DataTypes.FLOAT,
    ath_date: DataTypes.DATE,
    atl: DataTypes.FLOAT,
    atl_change_percentage: DataTypes.FLOAT,
    atl_date: DataTypes.DATE,
    last_updated: DataTypes.DATE,
    currency: {
        type: DataTypes.STRING,
        defaultValue: 'usd',
    }
});

module.exports = Coin;
