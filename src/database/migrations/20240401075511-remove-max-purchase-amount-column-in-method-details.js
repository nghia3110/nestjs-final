'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('method_details', 'max_purchase_amount');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('method_details', 'max_purchase_amount', {
      type: Sequelize.DOUBLE
    })
  }
};
