'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class admin_permissions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  admin_permissions.init({
    admin_permissions_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4
    },
    admin_id: {
      type:DataTypes.UUID
    },
    module:{
      type:DataTypes.STRING,
    },
    read:{
      type:DataTypes.BOOLEAN
    },
    write:{
      type:DataTypes.BOOLEAN
    }

  }, {
    sequelize,
    tableName:'admin_permissions',
    modelName: 'admin_permissions',
  });
  return admin_permissions;
};