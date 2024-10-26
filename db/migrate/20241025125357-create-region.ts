import {
    QueryInterface,
    SequelizeStatic
} from 'sequelize';

export = {
    up: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
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

    down: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
        return queryInterface.dropTable('Regions');
    }
};
