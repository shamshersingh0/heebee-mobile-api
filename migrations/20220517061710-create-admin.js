'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('admins', {
      admin_id:{
        allowNull:false,
        primaryKey:true,
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4
      },
      username:{
        type:DataTypes.STRING,
        allowNull:false
      },
      password:{
        type:DataTypes.STRING,
        allowNull:false
      },
      phone:{
        type:DataTypes.STRING
      },
      email:{
        type:DataTypes.STRING,
        allowNull:false
      },
      date_of_birth:{
        type:DataTypes.DATE
      },
      admin_role_id:{
        type:DataTypes.UUID,
        allowNull:false
      },
      branch_id:{
        type:DataTypes.UUID,
        allowNull:false
      },
      franchise_id:{
        type:DataTypes.UUID,
        allowNull:false
      },
      token:{
        type:DataTypes.STRING
      },
      gender:{
        type:DataTypes.STRING
      },
      OTP:{
        type:DataTypes.STRING
      },
      last_logged_in:{
        type:DataTypes.DATE
      },
      status:{
        type:DataTypes.STRING,
        defaultValue:'active'
      },
      from_ip:{
        type:DataTypes.STRING
      },
      device:{
        type:DataTypes.STRING
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
    await queryInterface.dropTable('admins');
  }
};