'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('customer_group_members', {
      customer_group_member_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
      },
      customer_group_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      customer_no: {
        type: DataTypes.STRING
      },
      customer_id: {
        type: DataTypes.UUID,
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
    await queryInterface.dropTable('customer_group_members');
  }
};