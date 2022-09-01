'use strict';

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('orders', {
      order_id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING
      },
      customer_no: {
        type: DataTypes.STRING
      },
      employee_id: {
        type: DataTypes.UUID,
        allowNull: true
      },
      branch_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      branch_name: {
        type: DataTypes.STRING
      },
      total_items: {
        type: DataTypes.INTEGER
      },
      paid_price: {
        type: DataTypes.FLOAT,
        defaultValue: 0
      },
      sub_total: {
        type: DataTypes.FLOAT,
        defaultValue: 0
      },
      tax: {
        type: DataTypes.FLOAT,
        defaultValue: 0
      },
      discount: {
        type: DataTypes.FLOAT,
        defaultValue: 0
      },
      applied_coupons: {
        type: DataTypes.JSONB
      },
      comment: {
        type: DataTypes.STRING
      },
      status: {
        type: DataTypes.STRING
      },
      paid: {
        type: DataTypes.BOOLEAN
      },
      completed_time: {
        type: DataTypes.STRING
      },
      payment_method: {
        type: DataTypes.STRING
      },
      payment_id: {
        type: DataTypes.STRING
      },
      account_id: {
        type: DataTypes.STRING
      },
      start_time: {
        type: DataTypes.STRING
      },
      ord_rec_time: {
        type: DataTypes.STRING
      },
      delivery_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      msg_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      received: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: true
      },
      change: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: true
      },
      cash_amount: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: true
      },
      card_amount: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: true
      },
      sgst: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: true
      },
      cgst: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: true
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true
      },
      order_type: {
        type: DataTypes.STRING,
        allowNull: true
      },
      pick_date: {
        type: DataTypes.DATE,
        allowNull: true
      },
      pick_time: {
        type: DataTypes.TIME,
        allowNull: true
      },
      order_from: {
        type: DataTypes.STRING,
        allowNull: true
      },
      membership_discount: {
        type: DataTypes.STRING,
      },
      bypass_otp: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      delivery_charges: {
        type: DataTypes.FLOAT,
        defaultValue: 0
      },
      old_order_id: {
        type: DataTypes.STRING,
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
    await queryInterface.dropTable('orders');
  }
};