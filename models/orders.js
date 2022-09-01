'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.order_items, { foreignKey: 'order_id' });
      this.belongsTo(models.employee, { as: "emplyees",foreignKey: 'employee_id' })
    }
  }
  orders.init({
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
      defaultValue: 0,
      get() {
        const rawValue = this.getDataValue('paid_price');
        return rawValue ? (rawValue.toFixed(2)) : 0;
      }
    },
    sub_total: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      get() {
        const rawValue = this.getDataValue('sub_total');
        return rawValue ? (rawValue.toFixed(2)) : 0;
      }
    },
    tax: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      get() {
        const rawValue = this.getDataValue('tax');
        return rawValue ? (rawValue.toFixed(2)) : 0;
      }
    },
    discount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      get() {
        const rawValue = this.getDataValue('discount');
        return rawValue ? (rawValue.toFixed(2)) : 0;
      }

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
      defaultValue: 0,
      get() {
        const rawValue = this.getDataValue('delivery_charges');
        return rawValue ? (rawValue.toFixed(2)) : 0;
      }
    },
    old_order_id:{
      type: DataTypes.STRING,
    }

  }, {
    sequelize,
    tableName: 'orders',
    modelName: 'orders',

  });
  return orders;
};