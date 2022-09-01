'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('wallet_transactions', {
      wallet_transactions_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      customer_id: {
        type: DataTypes.UUID
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
      amount: {
        type: DataTypes.FLOAT
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
      payment_method: {
        type: DataTypes.STRING
      },
      payment_id: {
        type: DataTypes.STRING
      },
      account_id: {
        type: DataTypes.STRING
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
    await queryInterface.dropTable('wallet_transactions');
  }
};