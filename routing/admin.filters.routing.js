const express = require("express");
const router = express.Router();
const filtersController = require("../controllers/admin.filters.controller");

router.route("/get_filters").get(filtersController.get_filters);

module.exports = router;