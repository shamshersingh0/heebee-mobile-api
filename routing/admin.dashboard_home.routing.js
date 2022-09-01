const express = require("express");
const router = express.Router();
const adminDashboardHomeController = require("../controllers/admin.dashboard_home.controller");

router.route("/dashboard_analytics").get(adminDashboardHomeController.dashboard_analytics);
router.route("/revenue_graph").get(adminDashboardHomeController.revenue_graph);
router.route("/sales_analytics_pie").get(adminDashboardHomeController.sales_analytics_pie);

module.exports = router;