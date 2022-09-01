'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class employee_logout_details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  employee_logout_details.init({
    employee_logout_details_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    employee_id: {
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    log_in: {
      type: DataTypes.DATE
    },
    log_out: {
      type: DataTypes.DATE
    },
    branch_id: {
      type: DataTypes.UUID,
    }
  }, {
    sequelize,
    modelName: 'employee_logout_details',
    tableName:'employee_logout_details'
  });
  return employee_logout_details;
};