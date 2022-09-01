const express = require("express");
const router = express.Router();
const adminProductController = require("../controllers/admin.product.controller");
const multer  = require('multer')
const upload = multer({ dest: 'uploads' })
const { admin_auth } = require('../middlewares/auth');

router.route("/add_category").post(upload.single('image'),adminProductController.addcategory);
router.route("/add_category_copy").post(upload.single('image'),adminProductController.addcategorycopy);
router.route("/add_fooditem").post(upload.single('image'),adminProductController.addnewfooditem);
router.route("/add_product_inbranch").post(adminProductController.addproductinbranch);
router.route("/add_addons").post(adminProductController.add_addons);
router.route("/add_product_addons").post(adminProductController.add_product_addons);
router.route("/add_addons_option").post(adminProductController.add_addons_option);
router.route("/update_addons").post(adminProductController.upd_addons);

router.route("/get_category").get(adminProductController.getcategories);
router.route("/get_add_on_products").get(adminProductController.get_add_on_products);
router.route("/get_product_add_ons").get(adminProductController.get_product_add_ons);
router.route("/get_category_branches").get(adminProductController.getcategorybranches);
router.route("/get_category_by_branches").get(adminProductController.getcategorybybranches);
router.route("/get_products").get(adminProductController.getproducts);
router.route("/get_product_details").get(adminProductController.getproductdetails);
router.route("/get_product_by_category").get(adminProductController.getproductbycategory);
router.route("/get_addons").get(adminProductController.getaddons);
router.route("/get_single_addons").get(adminProductController.getsingleaddons);
router.route("/del_single_addons").post(adminProductController.delsingleaddons);
router.route("/del_addons_option").post(adminProductController.deladdonsoption);
router.route("/search_product").get(adminProductController.search_product);
router.route("/edit_itemavailable").post(adminProductController.edititemavailable);

router.route("/edit_category_list").post(upload.single('image'),adminProductController.editcategorylist);
router.route("/add_product_branch").post(adminProductController.add_product_branch);
router.route("/edit_category").post(adminProductController.editcategory);
router.route("/edit_product_list").post(upload.single('image'),adminProductController.editproductlist);
router.route("/edit_product").post(adminProductController.editproduct);
router.route("/edit_addon").post(adminProductController.editaddon);
router.route("/add_addon_product").post(adminProductController.addaddonproduct);
router.route("/edit_addon_option").post(adminProductController.editaddonoption);
router.route("/edit_product_addon_order").post(adminProductController.edit_product_addon_order);

router.route("/delete_category_list").post(adminProductController.deletecategorylist);
router.route("/del_product_branch").post(adminProductController.del_product_branch);
router.route("/delete_addon_product").get(adminProductController.deleteaddonforproduct);
router.route("/delete_product_list").post(adminProductController.deleteproductlist);
router.route("/delete_addon_option").get(adminProductController.deleteaddonsoption);
router.route("/delete_addon").get(adminProductController.deleteaddon);
router.route("/delete_product_branchwise").post(adminProductController.deleteproductbranchwise);
router.route("/delete_category_branchwise").post(adminProductController.deletecategorybranchwise);



module.exports = router;