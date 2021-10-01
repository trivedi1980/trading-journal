'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SrLevels', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ticker: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      levels: {
        allowNull: false,
        type: Sequelize.JSON
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, {
      uniqueKeys: {
      }
    });

    await queryInterface.addConstraint('SrLevels', {
      fields: ['ticker'],
      type: 'unique',
      name: 'ticker_unique_constraint'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('SrLevels');
    await queryInterface.removeConstraint('SrLevels', 'ticker_unique_constraint');
  }
};