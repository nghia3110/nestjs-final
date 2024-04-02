'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('redeem_items', 'name', {
      allowNull: false,
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('redeem_items', 'photo', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('redeem_items', 'description', {
      type: Sequelize.TEXT
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('redeem_items', 'name');
    await queryInterface.removeColumn('redeem_items', 'photo');
    await queryInterface.removeColumn('redeem_items', 'description');
  }
};
