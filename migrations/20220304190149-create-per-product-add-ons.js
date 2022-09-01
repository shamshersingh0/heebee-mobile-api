'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('per_product_add_ons', {
      per_product_add_ons_id: {
        allowNull: false,
        primaryKey: true,
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4
      },
      product_list_id: {
        type:DataTypes.UUID
      },
      add_ons_id: {
        type:DataTypes.UUID
      },
      order:{
        type: DataTypes.INTEGER
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
    await queryInterface.dropTable('per_product_add_ons');
  }
};