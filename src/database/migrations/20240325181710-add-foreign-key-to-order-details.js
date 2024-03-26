'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('order_details', {
      fields: ['order_id'],
      type: 'foreign key',
      name: 'order_details_fk',
      references: {
        table: 'orders',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('order_details', {
      fields: ['item_id'],
      type: 'foreign key',
      name: 'order_details_item_fk',
      references: {
        table: 'items',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('order_details', 'order_details_fk');
    await queryInterface.removeConstraint('order_details', 'order_details_item_fk');
  }
};
