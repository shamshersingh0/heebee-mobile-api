'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('emp_cashier', {
      emp_cashier_id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      employee_id:{
        type:DataTypes.UUID
      },
      branch_id:{
        type:DataTypes.UUID
      },
      initial_cash:{
        type:DataTypes.FLOAT
      },
      final_cash:{
        type:DataTypes.FLOAT
      },
      total_revenue:{
        type:DataTypes.FLOAT
      },
      logged_in_time:{
        type:DataTypes.DATE
      },
      logout_time:{
        type:DataTypes.DATE
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
    await queryInterface.dropTable('emp_cashier');
  }
};