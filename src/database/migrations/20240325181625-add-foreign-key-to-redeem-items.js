'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('redeem_items', {
      fields: ['item_id'],
      type: 'foreign key',
      name: 'redeem_items_fk',
      references: {
        table: 'items',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('redeem_items', 'redeem_items_fk');
  }
};
