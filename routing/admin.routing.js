const express = require("express");
const router = express.Router();

const customer = require("./admin.customer.routing");
const employee = require("./admin.employee.routing");
const product = require("./admin.product.routing");
const dashboard_home = require("./admin.dashboard_home.routing");
const filters = require("./admin.filters.routing");
const franchise = require("./admin.franchise.routing")
const { admin_auth } = require('../middlewares/auth');
const adminController = require('../controllers/admin.controller');
const all_orders = require('./admin.all_orders.routing');
const all_groups = require('./admin.all_groups.routing');
const all_coupons = require('./admin.all_coupons.routing');
// Admin Auth Endpoints
router.route('/admin_signup').post(adminController.admin_signup);
router.route('/admin_login').post(adminController.admin_login);
router.route('/fetch_all_admin').get(adminController.fetch_all_admin);
router.route('/fetch_single_admin').get(adminController.fetch_single_admin);
// router.route('/update_admin_info').post(adminController.update_admin_info);
// router.route('/get_admin_info').get(adminController.get_admin_info);
// router.route('/add_admin_role').post(adminController.add_admin_role);
router.route('/update_admin_info').post(adminController.update_admin_info);
router.route('/get_admin_info').get(adminController.get_admin_info);
router.route('/add_admin_role').post(adminController.add_admin_role);
router.route('/get_admin_roles').get(adminController.get_admin_roles);

// Admin Modules
router.use('/customer', customer);
router.use('/employee', employee);
router.use('/product', product);
router.use('/dashboard_home', dashboard_home);
router.use('/filters', filters);
router.use('/franchise', franchise);
router.use('/all_orders',all_orders);
router.use('/all_groups',all_groups);
router.use('/all_coupons',all_coupons);

module.exports = router;