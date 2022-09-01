'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('customer_roles', {
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
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('customer_roles');
  }
};