'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      username: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      phone_number: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      total_points: {
        allowNull: false,
        type: Sequelize.DOUBLE,
        defaultValue: 0
      },
      current_points: {
        allowNull: false,
        type: Sequelize.DOUBLE,
        defaultValue: 0
      },
      role: {
        allowNull: false,
        type: Sequelize.STRING
      },
      rank_id: {
        allowNull: false,
        type: Sequelize.UUID
      },
      is_verified: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
