'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class emp_cashier extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  emp_cashier.init({
    emp_cashier_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    employee_id:{
      type:DataTypes.UUID
    },
    branch_id:{
      type:DataTypes.UUID
    },
    initial_cash:{
      type:DataTypes.FLOAT,
      defaultValue: 0
    },
    final_cash:{
      type:DataTypes.FLOAT,
      defaultValue: 0
    },
    total_revenue:{
      type:DataTypes.FLOAT,
      defaultValue: 0
    },
    logged_in_time:{
      type:DataTypes.DATE
    },
    logout_time:{
      type:DataTypes.DATE
    }
  }, {
    sequelize,
    tableName:'emp_cashier',
    modelName: 'emp_cashier',
  });
  return emp_cashier;
};