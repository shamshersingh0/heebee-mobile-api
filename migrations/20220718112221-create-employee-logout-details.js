'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('employee_logout_details', {
      employee_logout_details_id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      employee_id: {
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      log_in: {
        type: DataTypes.DATE
      },
      log_out: {
        type: DataTypes.DATE
      },
      branch_id: {
        type: DataTypes.UUID,
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
    await queryInterface.dropTable('employee_logout_details');
  }
};