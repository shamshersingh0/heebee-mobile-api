'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class items extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.categories,{foreignKey:'category_id'});
    }
  }
  items.init({
    item_id: {
      allowNull: false,
      primaryKey: true,
      type:DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4
    },
    item_name: {
      type:DataTypes.STRING,
      allowNull:false
    },
    sku: {
      type:DataTypes.STRING,
      allowNull:false
    },
    price: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    status: {
      type:DataTypes.STRING,
      allowNull:false
    },
    image_url:{
      type:DataTypes.STRING,
      allowNull:false
    },
    total_items: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    category_id: {
      type:DataTypes.UUID,
      allowNull:false
    }
  }, {
    sequelize,
    tableName:'items',
    modelName: 'items',
  });
  return items;
};