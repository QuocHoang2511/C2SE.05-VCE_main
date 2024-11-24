import {
    QueryInterface,
    SequelizeStatic
} from 'sequelize';

export = {
    up: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
        return queryInterface.createTable('Restaurants', {
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

            category: {
                type: Sequelize.STRING
            },

            main_dishes: {
                type: Sequelize.STRING
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

            admin_id: {
                type: Sequelize.INTEGER
            },

            user_id: {
                type: Sequelize.INTEGER
            },

            img_restaurant: {
                type: Sequelize.BLOB
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

    down: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
        return queryInterface.dropTable('Restaurants');
    }
};
