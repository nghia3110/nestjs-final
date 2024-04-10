'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('redeem_items', 'expried_time', 'expired_time');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('redeem_items', 'expired_time', 'expried_time');
  }
};
