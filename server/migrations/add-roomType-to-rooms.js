'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('rooms', 'roomType', {
      type: Sequelize.ENUM('standard', 'lux', 'family'),
      allowNull: false,
      defaultValue: 'standard',
      after: 'status'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('rooms', 'roomType');
  }
}; 