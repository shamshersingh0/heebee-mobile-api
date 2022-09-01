'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('employees', {
      employee_id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      full_name: {
        type: DataTypes.STRING,

      },
      mobile_no: {
        type: DataTypes.STRING,

      },
      email: {
        type: DataTypes.STRING,

      },
      profile_pic: {
        type: DataTypes.STRING,
        allowNull: true
      },
      password: {
        type: DataTypes.STRING,

      },
      date_of_birth: {
        type: DataTypes.DATEONLY,

      },
      address: {
        type: DataTypes.STRING,

      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'Active'
      },
      token: {
        type: DataTypes.STRING
      },
      branch: {
        type: DataTypes.STRING,

      },
      branch_id: {
        type: DataTypes.UUID,

      },
      employee_role: {
        type: DataTypes.STRING,
        allowNull: false
      },
      employee_role_id: {
        type: DataTypes.STRING,
        allowNull: false
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false
      },
      last_logged_in: {
        type: DataTypes.DATE
      },
      OTP: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      from_ip: {
        type: DataTypes.STRING,

      },
      device: {
        type: DataTypes.STRING,

      },
      perma_cat: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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
    await queryInterface.dropTable('employees');
  }
};