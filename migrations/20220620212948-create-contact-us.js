'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('contact_us', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      message: DataTypes.STRING,
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('contact_us');
  }
};