'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class wallet_transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  wallet_transaction.init({
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
      type: DataTypes.FLOAT,
      defaultValue: 0
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
    }
  }, {
    sequelize,
    modelName: 'wallet_transaction',
    tableName: 'wallet_transactions'
  });
  return wallet_transaction;
};