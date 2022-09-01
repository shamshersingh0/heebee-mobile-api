const express = require("express");
const router = express.Router();
const kitchenController = require("../controllers/kitchen.controller");
const {auth} = require("../middlewares/auth");

router.route("/fetch_all_orders/:number").get(auth,kitchenController.fetch_all_orders);
router.route("/get_completed_orders/:number").get(auth,kitchenController.get_completed_orders);
router.route("/get_preparing_orders/:number").get(auth,kitchenController.get_preparing_orders);
router.route("/update_order").post(auth,kitchenController.update_order);
router.route("/update_order_items").post(auth,kitchenController.update_order_items);
router.route("/kitchen_login").post(kitchenController.kitchen_login);
router.route("/employee_info").get(auth,kitchenController.employeeinfo);

module.exports = router;