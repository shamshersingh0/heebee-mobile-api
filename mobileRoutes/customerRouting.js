const express = require("express");
const router = express.Router();


const mobileController = require("../controllers/mobile.customer.controller");
const mobileCatgoryController = require("../controllers/mobile.category")



router.route('/customer_signup').post(mobileController.mobile_customer_signup);
router.route('/send_otp').post(mobileController.mobile_send_otp);
router.route('/customer_login').post(mobileController.mobile_customer_login);
router.route("/fetch_all_orders/:number").get( mobileController.mobile_fetch_all_orders);
router.route("/fetch_single_order").get( mobileController.mobile_fetch_single_order);
router.route("/fetch_all_categories/:number").get(mobileCatgoryController.allCategory);
router.route("/fetch_single_category/:number").get(mobileCatgoryController.singleCategory)
router.route("/fetch_all_product/:number").get(mobileCatgoryController.fetchAllProduct)
router.route("/fetch_single_product").get(mobileCatgoryController.fetchSingleProduct)
router.route("/fetch_most_ordered_product/:number").get(mobileCatgoryController.mostOrderedProduct)



module.exports = router;
