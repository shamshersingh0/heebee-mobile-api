const express = require("express");
const router = express.Router();
const { admin_auth } = require('../middlewares/auth');

const adminAllCouponsController = require("../controllers/admin.all_coupons.controller");

router.route("/fetch_all_coupons/:number").get(adminAllCouponsController.fetch_all_coupons);
router.route("/fetch_sngle_coupon").get(adminAllCouponsController.fetch_sngle_coupons);
router.route("/fetch_all_branch/:number").get(adminAllCouponsController.fetch_all_branch);
router.route("/search_customers/:number").get(adminAllCouponsController.search_customers);
router.route("/search_employees/:number").get(adminAllCouponsController.search_employees);
router.route("/search_coupons/:number").get(adminAllCouponsController.search_coupons);
router.route("/fetch_all_customer_groups/:number").get(adminAllCouponsController.fetch_all_customer_groups);
router.route("/update_coupons").post(adminAllCouponsController.update_coupons);
router.route("/get_all_customer_group").get(adminAllCouponsController.get_all_customer_group);
router.route("/add_coupon").post(adminAllCouponsController.add_coupon);
router.route("/delete_coupons/:coupon_id").post(adminAllCouponsController.delete_coupons);
router.route("/fetch_customer_roles").get(adminAllCouponsController.fetch_customer_roles);
router.route("/update_customer_roles").post(adminAllCouponsController.update_customer_roles);

module.exports = router;