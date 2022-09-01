const express = require("express");
const router = express.Router();
const adminFranchiseController = require("../controllers/admin.franchise.controller");
const { admin_auth } = require('../middlewares/auth');


router.route("/add_franchise").post(adminFranchiseController.addfranchise);
router.route("/add_branch").post(adminFranchiseController.addnewbranch);
router.route("/add_branch_copy").post(adminFranchiseController.addnewbranchcopy);
router.route("/add_cat_branch").post(adminFranchiseController.add_cat_branch);

router.route("/get_franchise").get(adminFranchiseController.getfranchise);
router.route("/get_branch").get(adminFranchiseController.getbranch);
router.route("/get_single_branch").get(adminFranchiseController.getsinglebranch);
router.route("/get_product_branch").get(adminFranchiseController.get_product_branch);
router.route("/search_product").get(adminFranchiseController.search_product);
router.route("/get_product_list").get(adminFranchiseController.get_product_list);
router.route("/get_category_list").get(adminFranchiseController.get_category_list);

router.route("/edit_franchise").post(adminFranchiseController.editfranchise);
router.route("/edit_branch").post(adminFranchiseController.editbranch);
router.route("/add_product_branch").post(adminFranchiseController.add_product_branch);
router.route("/del_product_branch").post(adminFranchiseController.del_product_branch);


router.route("/delete_branch").post(adminFranchiseController.deletebranch);
router.route("/delete_cat_branch").post(adminFranchiseController.delete_cat_branch);
router.route("/delete_franchise").post(adminFranchiseController.deletefranchise);


module.exports = router;