const Sequelize = require('sequelize');

// module.exports = new Sequelize('sd', 'chan', 'Zaq1xsw@', {
module.exports = new Sequelize('IngeniiGPS', 'ingenii', 'Cde#Vfr4', {
//     host: '45.77.168.194',
    host: '45.76.152.195',
     // host: 'localhost',
    dialect: 'mysql',
    timezone: '+05:30',
    define: {
        timestamps: false
    },
    logging: false
});
