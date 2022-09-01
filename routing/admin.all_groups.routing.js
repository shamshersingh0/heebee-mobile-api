const express = require("express");
const router = express.Router();
const { admin_auth } = require('../middlewares/auth');
const adminCustomerGroupController = require("../controllers/admin.all_groups.controller");

// Customer group related Routes
router.route("/add_new_group").post(adminCustomerGroupController.add_new_group);
router.route("/add_customer_to_group").post(adminCustomerGroupController.add_customers_to_group);
router.route("/get_all_customer_group").get(adminCustomerGroupController.get_all_customer_group);
router.route("/get_single_customer_group/:number").get(adminCustomerGroupController.get_single_customer_group);
router.route("/delete_customer_group").post(adminCustomerGroupController.delete_customer_group);
router.route("/delete_customer_from_group").post(adminCustomerGroupController.delete_customer_from_group);
router.route("/delete_all_customer_from_group").post(adminCustomerGroupController.delete_all_customer_from_group);
router.route("/add_single_customer_from_group").post(adminCustomerGroupController.add_single_customer_from_group);
router.route("/search_customer").get(adminCustomerGroupController.search_customer);
router.route("/update_customer_group").post(adminCustomerGroupController.update_customer_group);
router.route("/fetch_single_customer").get(adminCustomerGroupController.fetch_single_customer);


module.exports = router;