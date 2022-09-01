'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class customer_roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.customer, { foreignKey: 'customer_type' })
    }
  }
  customer_roles.init({

    customer_type: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    min_purchase: DataTypes.FLOAT,
    total_days: DataTypes.FLOAT,
    reduce_purchase: DataTypes.FLOAT,
    upg_purchase: DataTypes.FLOAT,
    upg_days: DataTypes.FLOAT,
    disc_percent: {
      type: DataTypes.INTEGER,
      allowNull: true
    }

  }, {
    sequelize,
    tableName: 'customer_roles',
    modelName: 'customer_roles',
  });
  return customer_roles;
};