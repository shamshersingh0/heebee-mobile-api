const express = require("express");
const router = express.Router();

const baristaController = require("../controllers/barista.controller");
const {auth} = require("../middlewares/auth");

router.route("/fetch_all_orders/:number").get(auth,baristaController.fetch_all_orders);
router.route("/get_completed_orders/:number").get(auth,baristaController.get_completed_orders);
router.route("/get_preparing_orders/:number").get(auth,baristaController.get_preparing_orders);
router.route("/update_order").post(auth,baristaController.update_order);
router.route("/update_order_items").post(auth,baristaController.update_order_items);
router.route("/barista_login").post(baristaController.barista_login);
router.route("/employee_info").get(auth,baristaController.employeeinfo);

module.exports = router;