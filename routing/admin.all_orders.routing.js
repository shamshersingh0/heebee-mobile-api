const express = require("express");
const router = express.Router();

const adminAllOrdersController = require("../controllers/admin.all_orders.controller");
const { admin_auth } = require('../middlewares/auth');

// Orders related Routes
router.route('/fetch_order_list/:number').get(adminAllOrdersController.fetch_order_list);
router.route('/fetch_customer_list/:number').get(adminAllOrdersController.fetch_customer_list);
router.route("/fetch_single_order").get(adminAllOrdersController.fetch_single_order);
router.route("/fetch_single_customer").get(adminAllOrdersController.fetch_single_customer);
router.route("/update_order").post(adminAllOrdersController.update_order);
router.route("/update_order_items").post(adminAllOrdersController.update_order_items);
router.route("/update_single_customer").post(adminAllOrdersController.update_single_customer);
router.route("/fetch_all_branches").get(adminAllOrdersController.fetch_all_branches);
router.route("/fetch_customer_roles").get(adminAllOrdersController.fetch_customer_roles);


// Customer group related Routes
router.route("/add_new_group").post(adminAllOrdersController.add_new_group);
router.route("/add_customer_to_group").post(adminAllOrdersController.add_customers_to_group);
router.route("/get_all_customer_group").get(adminAllOrdersController.get_all_customer_group);
router.route("/get_single_customer_group/:number").get(adminAllOrdersController.get_single_customer_group);
router.route("/delete_customer_group").post(adminAllOrdersController.delete_customer_group);
router.route("/delete_customer_from_group").post(adminAllOrdersController.delete_customer_from_group);
router.route("/delete_all_customer_from_group").post(adminAllOrdersController.delete_all_customer_from_group);
router.route("/add_single_customer_from_group").post(adminAllOrdersController.add_single_customer_from_group);

module.exports = router;