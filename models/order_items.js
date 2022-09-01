'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order_items extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.orders, { foreignKey: 'order_id' });
      this.belongsTo(models.product, { foreignKey: 'product_id' });
    }
  }
  order_items.init({
    order_items_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    order_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    add_ons: {
      type: DataTypes.JSON
    },
    add_ons_price: {
      type: DataTypes.JSON
    },
    total_price: {
      type: DataTypes.FLOAT
    },
    discount: {
      type: DataTypes.FLOAT
    },
    prepare_time: {
      type: DataTypes.STRING
    },
    completed_time: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.STRING
    },
    product_type: {
      type: DataTypes.STRING
    },
    food_type: {
      type: DataTypes.STRING
    },
    prepared_by: {
      type: DataTypes.UUID
    },
    quantity_completed: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    order_sku: {
      type: DataTypes.STRING,
      allowNull: true
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: true
    },
    delivery_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    branch_id: {
      type: DataTypes.UUID
    },
    old_order_id: {
      type: DataTypes.STRING,
    }
  }, {
    sequelize,
    tableName: 'order_items',
    modelName: 'order_items',
  });
  return order_items;
};