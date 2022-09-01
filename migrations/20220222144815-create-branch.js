'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('branches', {
      branch_id:{
        allowNull:false,
        primaryKey:true,
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4
      },
      branch_name: {
        type:DataTypes.STRING,
        allowNull:false
      },
      city: {
        type:DataTypes.STRING,
        allowNull:false
      },
      region:{
        type:DataTypes.STRING,
        allowNull:false
      },
      franchise_id:{
        type:DataTypes.UUID,
        allowNull:false
      },
      address:{
        type:DataTypes.STRING,
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
    await queryInterface.dropTable('branches');
  }
};
