'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('franchises', {
      franchise_id: {
        allowNull: false,
        primaryKey: true,
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4
      },
      franchise_name: {
        type:DataTypes.STRING,
        allowNull:false
      },
      location: {
        type:DataTypes.STRING,
        allowNull:false
      },
      no_branches:{
        type:DataTypes.INTEGER,
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
    await queryInterface.dropTable('franchises');
  }
};