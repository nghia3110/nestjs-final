'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('redeem_details', 'redeem_details_item_fk');

    await queryInterface.addConstraint('redeem_details', {
      fields: ['item_id'],
      type: 'foreign key',
      name: 'redeem_details_item_fk',
      references: {
        table: 'redeem_items',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('redeem_details', 'redeem_details_item_fk');

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
    })
  }
};
