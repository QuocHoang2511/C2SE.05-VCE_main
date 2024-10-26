"use strict";
module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('Regions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            region_id: {
                type: Sequelize.INTEGER
            },
            region_name: {
                type: Sequelize.STRING
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
    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('Regions');
    }
};
