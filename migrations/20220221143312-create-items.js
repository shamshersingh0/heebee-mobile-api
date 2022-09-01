'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('items', {
      item_id: {
        allowNull: false,
        primaryKey: true,
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4
      },
      item_name: {
        type:DataTypes.STRING,
        allowNull:false
      },
      sku: {
        type:DataTypes.STRING,
        allowNull:false
      },
      price: {
        type:DataTypes.INTEGER,
        allowNull:false
      },
      status: {
        type:DataTypes.STRING,
        allowNull:false
      },
      image_url:{
        type:DataTypes.STRING,
        allowNull:false
      },
      total_items: {
        type:DataTypes.INTEGER,
        allowNull:false
      },
      category_id: {
        type:DataTypes.UUID,
        allowNull:false
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
    await queryInterface.dropTable('items');
  }
};