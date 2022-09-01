'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class customer_ordered_product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  customer_ordered_product.init({
    customer_id: {
      type: DataTypes.UUID,
    },
    product_list_id: {
      type: DataTypes.UUID,
    },
    order_count:{
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  }, {
    sequelize,
    modelName: 'customer_ordered_product',
    tableName: 'customer_ordered_products'
  });
  return customer_ordered_product;
};