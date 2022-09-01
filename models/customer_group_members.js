'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class customer_group_members extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.customer_group, { foreignKey: 'customer_group_name' });
      this.belongsTo(models.customer, { foreignKey: 'customer_id' });
    }
  }
  customer_group_members.init({
    customer_group_member_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    customer_group_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    customer_no: {
      type: DataTypes.STRING
    },
    customer_id: {
      type: DataTypes.UUID,
    }
  }, {
    sequelize,
    tableName: 'customer_group_members',
    modelName: 'customer_group_members',
  });
  return customer_group_members;
};