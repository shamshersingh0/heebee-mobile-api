'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('product_lists', {
      product_list_id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      product_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      sku: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
      },
      card_img: {
        type: DataTypes.STRING
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      prepare_time: {
        type: DataTypes.STRING
      },
      product_type: {
        type: DataTypes.STRING
      },
      food_type: {
        type: DataTypes.STRING
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      ID: {
        allowNull: true,
        type: DataTypes.INTEGER
      },
      no_of_order: {
        type: DataTypes.INTEGER
      }
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('product_lists');
  }
};