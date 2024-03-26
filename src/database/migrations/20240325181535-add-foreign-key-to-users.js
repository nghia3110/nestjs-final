'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('users', {
      fields: ['rank_id'],
      type: 'foreign key',
      name: 'users_rank_fk',
      references: {
        table: 'ranks',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('users', 'users_rank_fk');
  }
};
