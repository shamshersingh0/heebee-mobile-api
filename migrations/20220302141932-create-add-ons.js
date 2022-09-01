'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('add_ons', {
      add_ons_id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      add_on_type: {
        type: DataTypes.STRING,
        defaultValue: "radio"
      },
      order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
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
    await queryInterface.dropTable('add_ons');
  }
};