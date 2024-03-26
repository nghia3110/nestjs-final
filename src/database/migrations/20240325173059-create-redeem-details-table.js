'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('redeem_details', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      redeem_id: {
        allowNull: false,
        type: Sequelize.UUID
      },
      item_id: {
        allowNull: false,
        type: Sequelize.UUID
      },
      quantity_redeem: {
        allowNull: false,
        type: Sequelize.INTEGER
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('redeem_details');
  }
};
