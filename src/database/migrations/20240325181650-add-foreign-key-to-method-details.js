'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('method_details', {
      fields: ['rank_id'],
      type: 'foreign key',
      name: 'method_details_rank_fk',
      references: {
        table: 'ranks',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('method_details', {
      fields: ['method_id'],
      type: 'foreign key',
      name: 'method_details_method_fk',
      references: {
        table: 'accumulate_methods',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('method_details', 'method_details_rank_fk');
    await queryInterface.removeConstraint('method_details', 'method_details_method_fk');
  }
};
