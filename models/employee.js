'use strict';
const {
  Model, DATE
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
     // Decide which Fields to return and hide 
     toJSON(){
      return {...this.get(),password:undefined}
    }
  }
  employee.init({
    employee_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    full_name: {
      type: DataTypes.STRING,

    },
    mobile_no: {
      type: DataTypes.STRING,

    },
    email: {
      type: DataTypes.STRING,

    },
    profile_pic: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,

    },
    date_of_birth: {
      type: DataTypes.DATEONLY,

    },
    address: {
      type: DataTypes.STRING,

    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Active'
    },
    token: {
      type: DataTypes.STRING
    },
    branch: {
      type: DataTypes.STRING,
    },
    branch_id: {
      type: DataTypes.UUID,
    },
    employee_role: {
      type: DataTypes.STRING,
      allowNull: false
    },
    employee_role_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_logged_in: {
      type: DataTypes.DATE
    },
    OTP: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    from_ip: {
      type: DataTypes.STRING,

    },
    device: {
      type: DataTypes.STRING,

    }
  }, {
    sequelize,
    tableName:'employees',
    modelName: 'employee',
  });
  return employee;
};
