'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.changeColumn('CommonsTrades', 'entry_reason', {
      type: Sequelize.TEXT,
    });

    await queryInterface.changeColumn('CommonsTrades', 'plan_details', {
      type: Sequelize.TEXT,
    });

    await queryInterface.changeColumn('CommonsTrades', 'exit_reason', {
      type: Sequelize.TEXT,
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     return Promise.all([
      queryInterface.changeColumn('CommonsTrades', 'entry_reason'),
      queryInterface.changeColumn('CommonsTrades', 'plan_details'),
      queryInterface.changeColumn('CommonsTrades', 'exit_reason')
     ]);
  }
};
