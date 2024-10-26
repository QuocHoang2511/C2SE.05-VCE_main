"use strict";
module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('FeatureDishes', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            featured_dish_id: {
                type: Sequelize.INTEGER
            },
            dish_id: {
                type: Sequelize.INTEGER
            },
            user_id: {
                type: Sequelize.INTEGER
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
        return queryInterface.dropTable('FeatureDishes');
    }
};
