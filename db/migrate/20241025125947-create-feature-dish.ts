import {
    QueryInterface,
    SequelizeStatic
} from 'sequelize';

export = {
    up: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
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

    down: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
        return queryInterface.dropTable('FeatureDishes');
    }
};
