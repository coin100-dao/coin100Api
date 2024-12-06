// src/models/TotalTop100Cap.js
import { Model, DataTypes } from 'sequelize';

export default function(sequelize) {
    class TotalTop100Cap extends Model {}
    
    TotalTop100Cap.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false
        },
        total_market_cap: {
            type: DataTypes.DECIMAL(30, 0),
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'TotalTop100Cap',
        tableName: 'total_top100_cap',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return TotalTop100Cap;
}
