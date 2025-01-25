const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const GroupMessage = sequelize.define('groupMessage', {
    id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    message: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    timestamp: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }, // Sender of the message
    groupId: {
        type: Sequelize.INTEGER,
        allowNull: false
    } // Group in which the message was sent
});

module.exports = GroupMessage;