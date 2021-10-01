'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CommonsTrades', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      trade_open_date: {
        type: Sequelize.DATE
      },
      trade_close_date: {
        type: Sequelize.DATE
      },
      ticker: {
        type: Sequelize.STRING
      },
      entry_reason: {
        type: Sequelize.STRING
      },
      plan_details: {
        type: Sequelize.STRING
      },
      exit_reason: {
        type: Sequelize.STRING
      },
      stock_price_at_open: {
        type: Sequelize.FLOAT
      },
      stock_price_at_exit: {
        type: Sequelize.FLOAT
      },
      size: {
        type: Sequelize.INTEGER
      },
      trade_outcome: {
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('CommonsTrades');
  }
};