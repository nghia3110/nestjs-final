'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('redeem', 'store_id', {
      allowNull: false,
      type: Sequelize.UUID
    });

    await queryInterface.addConstraint('redeem', {
      fields: ['store_id'],
      type: 'foreign key',
      name: 'redeem_store_fk',
      references: {
        table: 'stores',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('redeem', 'redeem_store_fk');
    await queryInterface.removeColumn('redeem', 'store_id');
  }
};
