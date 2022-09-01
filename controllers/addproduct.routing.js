const express = require("express");
const router = express.Router();

const addproductController = require("./addproduct.controller");

router.route('/add_bulk_product').get(addproductController.addproductbulk);
router.route('/add_bulk_customer').get(addproductController.addcustomerbulk);
router.route('/get_bulk_customer').get(addproductController.getcustomerbulk);
router.route('/get_bulk_product').get(addproductController.getproductbulk);
router.route('/add_branch').get(addproductController.addbranch);
router.route('/get_bulk_order').get(addproductController.addorderbulk);
router.route('/del_bulk_order').get(addproductController.delorderbulk);


module.exports = router;