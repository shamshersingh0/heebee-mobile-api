'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('admin_permissions', {
      admin_permissions_id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4
      },
      admin_id: {
        type:DataTypes.UUID
      },
      module:{
        type:DataTypes.STRING,
      },
      read:{
        type:DataTypes.BOOLEAN
      },
      write:{
        type:DataTypes.BOOLEAN
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
    await queryInterface.dropTable('admin_permissions');
  }
};