'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('customers', {
      customer_id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      first_name: {
        type: DataTypes.STRING,
      },
      last_name: {
        type: DataTypes.STRING,
      },
      mobile_no: {
        type: DataTypes.STRING,
      },
      profile_pic: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
      },
      date_of_birth: {
        type: DataTypes.DATEONLY,
      },
      gender: {
        type: DataTypes.STRING,

      },
      branch: {
        type: DataTypes.STRING,
      },
      branch_id: {
        type: DataTypes.UUID,
      },
      customer_type: {
        type: DataTypes.STRING,
        defaultValue: 'General'
      },
      shipping_address: {
        type: DataTypes.JSON
      },
      password: {
        type: DataTypes.STRING
      },
      billing_address: {
        type: DataTypes.JSON
      },
      start_date: {
        type: DataTypes.DATEONLY,
      },
      memb_days_left: {
        type: DataTypes.FLOAT,
        defaultValue: 0
      },
      memb_upg_categ: {
        type: DataTypes.STRING,
        defaultValue: "Silver"
      },
      memb_amount: {
        type: DataTypes.FLOAT,
        defaultValue: 0
      },
      memb_upg_amount: {
        type: DataTypes.FLOAT,
        defaultValue: 0
      },
      memb_reduce_amount: {
        type: DataTypes.FLOAT,
        defaultValue: 0
      },
      wallet_balance: {
        type: DataTypes.FLOAT,
        defaultValue: 0
      },
      OTP: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      MEMB_OTP: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      token: {
        type: DataTypes.STRING
      },
      perma_cat: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      ID: {
        allowNull: true,
        type: DataTypes.INTEGER
      },
      total_spend: {
        type: DataTypes.FLOAT,
        defaultValue: 0
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
    await queryInterface.dropTable('customers');
  }
};