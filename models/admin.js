'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.admin_role,{foreignKey:'admin_role_id'});
      this.hasMany(models.admin_permissions,{foreignKey:'admin_id'});
    }
  }
  admin.init({
    admin_id:{
      allowNull:false,
      primaryKey:true,
      type:DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4
    },
    username:{
      type:DataTypes.STRING,
      allowNull:false
    },
    password:{
      type:DataTypes.STRING,
      allowNull:false
    },
    phone:{
      type:DataTypes.STRING
    },
    email:{
      type:DataTypes.STRING,
      allowNull:false
    },
    date_of_birth:{
      type:DataTypes.DATE
    },
    admin_role_id:{
      type:DataTypes.UUID,
      allowNull:false
    },
    branch_id:{
      type:DataTypes.UUID,
      allowNull:false
    },
    franchise_id:{
      type:DataTypes.UUID,
      allowNull:false
    },
    token:{
      type:DataTypes.STRING
    },
    gender:{
      type:DataTypes.STRING
    },
    OTP:{
      type:DataTypes.STRING
    },
    last_logged_in:{
      type:DataTypes.DATE
    },
    status:{
      type:DataTypes.STRING,
      defaultValue:'active'
    },
    from_ip:{
      type:DataTypes.STRING

    },
    device:{
      type:DataTypes.STRING
    }
  }, {
    sequelize,
    tableName:'admins',
    modelName: 'admin',
  });
  return admin;
};