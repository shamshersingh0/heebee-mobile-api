const express = require("express");
const router = express.Router();

const customerController = require("../controllers/customer.controller");
const { customer_auth } = require("../middlewares/auth");

router.route('/customer_signup').post(customerController.customer_signup);
router.route('/customer_login').post(customerController.customer_login);
router.route('/checkout_order').post(customer_auth, customerController.checkout_order);
router.route("/update_order").post(customer_auth, customerController.update_order);
router.route("/contact_us").post(customerController.contact_us);
router.route("/fetch_all_orders/:number").get(customer_auth, customerController.fetch_all_orders);
router.route("/fetch_single_order").get(customer_auth, customerController.fetch_single_order);
router.route("/valid_coupons").post(customer_auth, customerController.valid_coupons);
router.route('/edit_profile').post(customer_auth, customerController.edit_profile);
router.route('/get_categories').get(customerController.get_categories);
router.route('/get_products/:number').get(customerController.get_products);
router.route('/send_otp').post(customerController.send_otp);
router.route('/customer_info').get(customer_auth, customerController.customer_info);
router.route('/get_branches').get(customerController.get_branches);
router.route('/best_seller').get(customerController.best_seller);
router.route('/verify_otp').post(customerController.verify_otp);
router.route('/change_password').post(customerController.change_password);

module.exports = router;