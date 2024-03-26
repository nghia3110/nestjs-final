'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('items', {
      fields: ['store_id'],
      type: 'foreign key',
      name: 'items_store_fk',
      references: {
        table: 'stores',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('items', 'items_store_fk');
  }
};
