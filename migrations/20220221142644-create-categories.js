'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('categories', {
      category_id:{
        type:DataTypes.UUID,
        primaryKey:true,
        allowNull:false,
        defaultValue:DataTypes.UUIDV4
      },
      category_list_id:{
        type:DataTypes.UUID,
        allowNull:false
      },
      branch_id:{
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
    await queryInterface.dropTable('categories');
  }
};