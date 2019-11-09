const Sequelize = require('sequelize');
const db = require('../database');

const GPSData = db.define(
    'GPSData',
    {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        imei: {
            type: Sequelize.BIGINT,
            require: true
        },
        // timestamp: {
        //     type: Sequelize.DATE
        // },
        // priority: {
        //     type: Sequelize.INTEGER
        // },
        longitude: {
            type: Sequelize.DECIMAL,
            require: true
        },
        latitude: {
            type: Sequelize.DECIMAL,
            require: true
        },
        // altitude: {
        //     type: Sequelize.DECIMAL,
        // },
        // angel: {
        //     type: Sequelize.DECIMAL,
        // },
        // satellites: {
        //     type: Sequelize.DECIMAL,
        // },
        // speed: {
        //     type: Sequelize.DECIMAL,
        // },
        // ignition: {
        //     type: Sequelize.BOOLEAN,
        // },
        // movement: {
        //     type: Sequelize.BOOLEAN,
        // },
        // dataMode: {
        //     type: Sequelize.INTEGER,
        // },
        // gsmSignalStrength: {
        //     type: Sequelize.SMALLINT,
        // },
        // sleepMode: {
        //     type: Sequelize.BOOLEAN,
        // },
        // gnssStatus: {
        //     type: Sequelize.SMALLINT,
        // },
        // ignition: {
        //     type: Sequelize.BOOLEAN,
        // },
        // ignition: {
        //     type: Sequelize.BOOLEAN,
        // },


    },
    {
        tableName: 'GPSData',
        timestamp: false
    }
    )
;

module.exports = GPSData;
