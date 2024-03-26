'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('redeem_details', {
      fields: ['redeem_id'],
      type: 'foreign key',
      name: 'redeem_details_fk',
      references: {
        table: 'redeem',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('redeem_details', {
      fields: ['item_id'],
      type: 'foreign key',
      name: 'redeem_details_item_fk',
      references: {
        table: 'items',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('redeem_details', 'redeem_details_fk');
    await queryInterface.removeConstraint('redeem_details', 'redeem_details_item_fk');
  }
};
