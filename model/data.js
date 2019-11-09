const Sequelize = require('sequelize');
const db = require('../database');

const Data = db.define(
    'data',
    {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        packet: {
            type: Sequelize.STRING,
            require: true
        }
    },
    {
        tableName: 'data',
        timestamp: false
    }
);

module.exports = Data;
