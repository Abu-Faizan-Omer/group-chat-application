const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const GroupMember = sequelize.define('groupMember', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    groupId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false // Indicates whether the user is an admin of the group.
    }
});

module.exports = GroupMember;