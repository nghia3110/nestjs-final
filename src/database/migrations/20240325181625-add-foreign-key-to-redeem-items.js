'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('redeem_items', 'store_id', {
      allowNull: false,
      type: Sequelize.UUID
    });
    await queryInterface.removeColumn('redeem_items', 'item_id');
    await queryInterface.addConstraint('redeem_items', {
      fields: ['store_id'],
      type: 'foreign key',
      name: 'redeem_items_store_fk',
      references: {
        table: 'stores',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('redeem_items', 'redeem_items_store_fk');
    await queryInterface.removeColumn('redeem_items', 'store_id');
    await queryInterface.addColumn('redeem_items', 'item_id', {
      allowNull: false,
      type: Sequelize.UUID
    })
  }
};
