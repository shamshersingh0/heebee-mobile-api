'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class employee_role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  employee_role.init({
    employee_role_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4
    },
    employee_role: {
      type: DataTypes.STRING,
      allowNull:false
    },
  }, {
    sequelize,
    tableName:'employee_roles',
    modelName: 'employee_roles',
  });
  return employee_role;
};