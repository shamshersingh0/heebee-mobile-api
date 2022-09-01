'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order_history extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.order_items_history, { foreignKey: 'order_history_id' });
    }
  }
  order_history.init({
    order_history_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    order_id: {
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
      type: DataTypes.FLOAT
    },
    sub_total: {
      type: DataTypes.FLOAT
    },
    tax: {
      type: DataTypes.FLOAT
    },
    discount: {
      type: DataTypes.FLOAT
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
      allowNull: true
    },
    change: {
      type: DataTypes.FLOAT,
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
    cash_amount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    card_amount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    sgst: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    cgst: {
      type: DataTypes.FLOAT,
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
    }
  }, {
    sequelize,
    tableName: 'order_history',
    modelName: 'order_history',
  });
  return order_history;
};