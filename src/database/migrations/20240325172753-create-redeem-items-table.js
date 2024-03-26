'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('redeem_items', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      exchange_point: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      expried_time: {
        allowNull: false,
        type: Sequelize.DATE
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      item_id: {
        allowNull: false,
        type: Sequelize.UUID
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
    await queryInterface.dropTable('redeem_items');
  }
};
