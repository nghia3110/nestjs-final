'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('orders', 'store_id', {
      allowNull: false,
      type: Sequelize.UUID
    });

    await queryInterface.addConstraint('orders', {
      fields: ['store_id'],
      type: 'foreign key',
      name: 'orders_store_fk',
      references: {
        table: 'stores',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('orders', 'orders_store_fk');
    await queryInterface.removeColumn('orders', 'store_id');
  }
};
