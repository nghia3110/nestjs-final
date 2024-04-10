'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('order_details', 'status', {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      defaultValue: 'pending'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('order_details', 'status');
  }
};
