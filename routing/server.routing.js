const express = require("express");
const router = express.Router();

const serverController = require("../controllers/server.controller");
const {auth} = require("../middlewares/auth");

router.route("/server_login").post(serverController.server_login);
router.route("/get_non_delivered_orders/:number").get(auth,serverController.get_non_delivered_orders);
router.route("/get_delivered_orders/:number").get(auth,serverController.get_delivered_orders);
router.route("/update_order").post(auth,serverController.update_order);
router.route("/update_order_items").post(auth,serverController.update_order_items);
router.route("/update_batch_delivery_status").post(auth,serverController.update_batch_delivery_status);
router.route("/employee_info").get(auth,serverController.employee_info);


module.exports = router