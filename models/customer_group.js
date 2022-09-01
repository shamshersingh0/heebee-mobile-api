'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class customer_group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.customer_group_members,{foreignKey:'customer_group_name',onDelete:'CASCADE'});
    }
  }
  customer_group.init({
    customer_group_name:{
      type:DataTypes.STRING,
      primaryKey:true,
      allowNull:false
    },

  }, {
    sequelize,
    tableName:'customer_groups',
    modelName: 'customer_group',
  });
  return customer_group;
};