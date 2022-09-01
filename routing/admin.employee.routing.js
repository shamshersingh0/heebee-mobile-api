const express = require("express");
const router = express.Router();
const adminEmployeeController = require("../controllers/admin.employee.controller");
const { admin_auth } = require('../middlewares/auth');

router.route("/add_new_employee").post(adminEmployeeController.add_new_employee);
router.route("/update_single_employee").post(adminEmployeeController.update_single_employee);
router.route("/get_employee_roles").get(adminEmployeeController.get_employee_roles);
router.route("/get_employee").get(adminEmployeeController.get_employee);
router.route("/fetch_all_branches").get(adminEmployeeController.fetch_all_branches);
router.route("/get_all_employees/:number").get(adminEmployeeController.get_all_employees);
router.route("/employee_sales_analytics").get(adminEmployeeController.employee_sales_analytics);
router.route("/search_emp").get(adminEmployeeController.search_emp);
router.route("/get_employee_orders/:number").get(adminEmployeeController.get_employee_orders);
router.route("/get_employee_login_details/:number").post(adminEmployeeController.get_employee_login_details);
router.route("/get_single_employee_logout_report").post(adminEmployeeController.get_single_employee_logout_report);

// reports

router.route("/staff_reports").post(adminEmployeeController.staff_reports);
router.route("/staff_reports_by_daily").post(adminEmployeeController.staff_reports_by_daily);
router.route("/staff_order_list").post(adminEmployeeController.staff_order_list);



module.exports = router;