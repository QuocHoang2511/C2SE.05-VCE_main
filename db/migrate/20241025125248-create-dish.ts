import { QueryInterface, SequelizeStatic } from "sequelize";

export = {
  up: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
    return queryInterface.createTable("Dishes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      name: {
        type: Sequelize.STRING,
      },

      restaurant_id: {
        type: Sequelize.INTEGER,
      },

      description: {
        type: Sequelize.STRING,
      },

      price: {
        type: Sequelize.FLOAT,
      },

      img: {
        type: Sequelize.BLOB,
      },
      city_id: {
        type: Sequelize.INTEGER,
      },

      user_id: {
        type: Sequelize.INTEGER,
      },
      main_dish: {
        type: Sequelize.BOOLEAN,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
    return queryInterface.dropTable("Dishes");
  },
};
