'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('products', {
      product_id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      product_list_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      branch_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      category_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      status: {
        type: DataTypes.BOOLEAN
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      items_available: {
        type: DataTypes.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      no_of_order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('products');
  }
};