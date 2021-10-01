'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PriceActions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ticker: {
        type: Sequelize.STRING,
        unique: 'ticker_period_unique_constraint'
      },
      period: {
        type: Sequelize.STRING,
        unique: 'ticker_period_unique_constraint'
      },
      data: {
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
          actions_unique: {
              fields: ['ticker', 'period']
          }
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('PriceActions');
  }
};