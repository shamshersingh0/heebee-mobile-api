const express = require("express");
const router = express.Router();
const adminCustomerController = require("../controllers/admin.customer.controller");
const { admin_auth } = require('../middlewares/auth');


// gives the details of customer order history by their phone numbers
router.route("/customer_order_history/:no").get(adminCustomerController.customer_order_history);

// person fetches the customer according to their roles
router.route("/fetch_customers/:no").get(adminCustomerController.fetch_customers);



// fetch_customer_list
router.route('/fetch_customer_list/:number').get(adminCustomerController.fetch_customer_list);

router.route("/add_new_group").post(adminCustomerController.add_new_group);
router.route("/add_customer_to_group").post(adminCustomerController.add_customers_to_group);
router.route("/get_all_customer_group").get(adminCustomerController.get_all_customer_group);

// gives the customers according to month and yearwise
router.route("/customer_dashboard").get(adminCustomerController.customer_dashboard);

// customer analytics graph
router.route("/customer_analytics_graph").get(adminCustomerController.customer_analytics_graph);

// customer analytics pie chart
router.route("/customer_analytics_pie").get(adminCustomerController.customer_analytics_pie);

// order analytics graph
router.route("/order_analytics_graph").get(adminCustomerController.order_analytics_graph);

// get average purchase
router.route("/avg_purchase").get(adminCustomerController.avg_purchase);

// add_customer
router.route("/add_customer").post(adminCustomerController.add_customer);

// update_single_customer
router.route("/update_single_customer").post(adminCustomerController.update_single_customer);

// fetch_customer_roles
router.route("/fetch_customer_roles").get(adminCustomerController.fetch_customer_roles);

// fetch_single_customer
router.route("/fetch_single_customer").get(adminCustomerController.fetch_single_customer);

module.exports = router;