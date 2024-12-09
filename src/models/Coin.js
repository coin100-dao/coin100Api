// src/models/Coin.js
import { Model, DataTypes } from 'sequelize';

export default function(sequelize) {
    class Coin extends Model {}
    
    Coin.init({
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        last_updated: {
            type: DataTypes.DATE,
            primaryKey: true,
            allowNull: false
        },
        symbol: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING
        },
        image: {
            type: DataTypes.STRING
        },
        current_price: {
            type: DataTypes.DECIMAL(20, 8)
        },
        market_cap: {
            type: DataTypes.DECIMAL(20, 0)
        },
        market_cap_rank: {
            type: DataTypes.INTEGER
        },
        fully_diluted_valuation: {
            type: DataTypes.DECIMAL(20, 0)
        },
        total_volume: {
            type: DataTypes.DECIMAL(20, 0)
        },
        high_24h: {
            type: DataTypes.DECIMAL(20, 8)
        },
        low_24h: {
            type: DataTypes.DECIMAL(20, 8)
        },
        price_change_24h: {
            type: DataTypes.DECIMAL(20, 8)
        },
        price_change_percentage_24h: {
            type: DataTypes.DECIMAL(10, 2)
        },
        market_cap_change_24h: {
            type: DataTypes.DECIMAL(20, 0)
        },
        market_cap_change_percentage_24h: {
            type: DataTypes.DECIMAL(10, 2)
        },
        circulating_supply: {
            type: DataTypes.DECIMAL(20, 0)
        },
        total_supply: {
            type: DataTypes.DECIMAL(20, 0)
        },
        max_supply: {
            type: DataTypes.DECIMAL(20, 0)
        },
        ath: {
            type: DataTypes.DECIMAL(20, 8)
        },
        ath_change_percentage: {
            type: DataTypes.DECIMAL(10, 2)
        },
        ath_date: {
            type: DataTypes.DATE
        },
        atl: {
            type: DataTypes.DECIMAL(20, 8)
        },
        atl_change_percentage: {
            type: DataTypes.DECIMAL(10, 2)
        },
        atl_date: {
            type: DataTypes.DATE
        },
        currency: {
            type: DataTypes.STRING,
            defaultValue: 'usd'
        }
    }, {
        sequelize,
        modelName: 'Coin',
        tableName: 'coins',
        timestamps: false,
        indexes: [
            {
                fields: ['symbol', 'last_updated']
            }
        ]
    });

    return Coin;
}
