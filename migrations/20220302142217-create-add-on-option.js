'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('add_on_options', {
      add_on_option_id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4
      },
      add_ons_id:{
        type:DataTypes.UUID,
        allowNull:false
      },
      title: {
        type: DataTypes.STRING,
        allowNull:false
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull:false
      },
      sku: {
        type: DataTypes.STRING,
        allowNull:false
      },
      order:{
        type:DataTypes.INTEGER
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
    await queryInterface.dropTable('add_on_options');
  }
};