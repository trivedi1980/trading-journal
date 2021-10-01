'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn('OptionsTrades', 'entry_reason', {
      type: Sequelize.TEXT,
    });

    await queryInterface.changeColumn('OptionsTrades', 'plan_details', {
      type: Sequelize.TEXT,
    });

    await queryInterface.changeColumn('OptionsTrades', 'exit_reason', {
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
       queryInterface.changeColumn('OptionsTrade', 'entry_reason'),
       queryInterface.changeColumn('OptionsTrade', 'plan_details'),
       queryInterface.changeColumn('OptionsTrade', 'exit_reason')
      ]);
  }
};
