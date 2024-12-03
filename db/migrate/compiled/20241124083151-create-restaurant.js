"use strict";
module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable("Restaurants", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            restaurant_name: {
                type: Sequelize.STRING
            },
            address: {
                type: Sequelize.STRING
            },
            phone_number: {
                type: Sequelize.STRING
            },
            main_dishes: {
                type: Sequelize.INTEGER
            },
            city_id: {
                type: Sequelize.INTEGER
            },
            description: {
                type: Sequelize.TEXT
            },
            approved: {
                type: Sequelize.BOOLEAN
            },
            user_id: {
                type: Sequelize.INTEGER
            },
            img_restaurant: {
                type: Sequelize.BLOB
            },
            favourite: {
                type: Sequelize.BOOLEAN
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
        return queryInterface.dropTable("Restaurants");
    }
};
