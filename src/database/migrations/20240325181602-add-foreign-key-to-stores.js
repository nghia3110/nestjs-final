'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('stores', {
      fields: ['method_id'],
      type: 'foreign key',
      name: 'stores_method_fk',
      references: {
        table: 'accumulate_methods',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('stores', 'stores_method_fk');
  }
};
