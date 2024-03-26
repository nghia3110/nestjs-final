'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('method_details', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      method_id: {
        allowNull: false,
        type: Sequelize.UUID
      },
      rank_id: {
        allowNull: false,
        type: Sequelize.UUID
      },
      fixed_point: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      max_point: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      percentage: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      max_purchase_amount: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
    });
    /**
     * Add altering commands here.
     *
     * Example:
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('method_details');
    /**
     * Add reverting commands here.
     *
     * Example:
     */
  }
};
