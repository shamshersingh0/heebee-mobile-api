'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class coupons extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  coupons.init({
    coupon_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    coupon_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    start: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    end: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    disc_percent: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    flat_discount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    customer_no: {
      type: DataTypes.STRING,
      allowNull: true
    },
    employee_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    branch_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    min_cart: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    customer_group_name: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    tableName: 'coupons',
    modelName: 'coupons',
  });
  return coupons;
};