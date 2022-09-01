const express = require("express");
const router = express.Router();
const adminPermissionsController = require("../controllers/admin.permissions.controller");
const {admin_auth} = require("../middlewares/auth");

router.route("/add_permissions").post(adminPermissionsController.add_permissions);
router.route("/edit_permissions").post(adminPermissionsController.edit_permissions);
router.route("/fetch_permissions").get(adminPermissionsController.fetch_permissions);

module.exports = router;