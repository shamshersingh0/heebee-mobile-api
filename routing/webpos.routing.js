const express = require("express");
const router = express.Router();
const webposController = require("../controllers/webpos.controller");
const { auth } = require("../middlewares/auth");

// WEBPOS routes
/*------------------------------------------------------------------------
                        Checkout Order Endpoints                         
--------------------------------------------------------------------------*/
router.route("/checkout_order").post(auth, webposController.checkout_order);
router.route("/fetch_all_orders/:number").get(auth, webposController.fetch_all_orders);
router.route("/add_cust_wallet_money").post(auth, webposController.addcustwalletmoney);
router.route("/update_order").post(auth, webposController.update_order);
router.route("/update_hold_order").post(auth, webposController.update_hold_order);
router.route("/update_order_items").post(auth, webposController.update_order_items);
router.route("/add_options").post(webposController.add_options);
router.route("/get_completed_orders/:number").get(auth, webposController.get_completed_orders);
router.route("/get_preparing_orders/:number").get(auth, webposController.get_preparing_orders);
router.route("/get_cancelled_orders/:number").get(auth, webposController.get_cancelled_orders);
router.route("/get_hold_orders/:number").get(auth, webposController.get_hold_orders);
router.route("/get_emp_completed_orders/:number").get(auth, webposController.get_emp_completed_orders);
router.route("/get_emp_preparing_orders/:number").get(auth, webposController.get_emp_preparing_orders);
router.route("/get_emp_cancelled_orders/:number").get(auth, webposController.get_emp_cancelled_orders);
router.route("/get_emp_hold_orders/:number").get(auth, webposController.get_emp_hold_orders);
router.route("/get_emp_completed_orders_logout_time/:number").get(auth, webposController.get_emp_completed_orders_logout_time);
router.route("/get_emp_preparing_orders_logout_time/:number").get(auth, webposController.get_emp_preparing_orders_logout_time);
router.route("/get_emp_cancelled_orders_logout_time/:number").get(auth, webposController.get_emp_cancelled_orders_logout_time);
router.route("/get_emp_hold_orders_logout_time/:number").get(auth, webposController.get_emp_hold_orders_logout_time);
router.route("/fetch_single_order").get(auth, webposController.fetch_single_order);
router.route("/search_order/:number").get(auth, webposController.search_order);
router.route("/del_cat").get(webposController.del_cat);
/*------------------------------------------------------------------------
                        Employees related Endpoints                         
--------------------------------------------------------------------------*/
router.route("/emp_login").post(webposController.loginemployee);
router.route("/emp_register").post(webposController.registeremployee);
// router.route("/forgot_password_emp").post(webposController.forgot_password_emp);
router.route("/employee_info").get(webposController.employeeinfo);
router.route("/reset_password_emp").post(webposController.reset_password_employee);
router.route("/add_employee_role").post(webposController.add_employee_role);
router.route("/logout_employee_orders/:number").get(webposController.logout_employee_orders);

/*------------------------------------------------------------------------
                        Customers related Endpoints                         
--------------------------------------------------------------------------*/
router.route("/new_customer").post(webposController.newcustomer);
router.route("/send_otp_memb_cust").post(webposController.sendotpmembcust);
router.route("/verify_mem_otp").post(webposController.verify_mem_otp);
router.route("/send_otp_cust").post(webposController.sendotpcust);
router.route("/verify_otp").post(webposController.verifyotp);
router.route("/guest_customer").post(webposController.guestcustomer);
router.route("/customer_search").get(auth, webposController.searchcustomer);
router.route("/customer_info").get(auth, webposController.customerinfo);

/*------------------------------------------------------------------------
                        Categories & Products Endpoints                         
--------------------------------------------------------------------------*/
router.route("/add_category").post(webposController.addcategory);
router.route("/add_addon").post(webposController.add_addon);
router.route("/add_new_product").post(webposController.addnewproduct);
router.route("/get_all_categories").get(auth, webposController.getallcategories);
router.route("/get_single_category").get(auth, webposController.getsinglecategory);
router.route("/get_category_by_branch").get(auth, webposController.get_category_by_branch);
router.route("/get_all_products").get(auth, webposController.getallproducts);
router.route("/get_single_product").get(auth, webposController.get_single_product);
router.route("/get_product/:number").get(auth, webposController.get_products);
router.route("/get_product_by_branch").get(auth, webposController.get_product_by_branch);

/*------------------------------------------------------------------------
                        Coupons                         
--------------------------------------------------------------------------*/
router.route("/valid_coupons").post(auth, webposController.valid_coupons);
router.route("/add_coupons").post(webposController.add_coupons);

/*------------------------------------------------------------------------
                       Franchise & Branch Endpoints                         
--------------------------------------------------------------------------*/
router.route("/add_new_franchise").post(webposController.addfranchise);
router.route("/add_new_branch").post(webposController.addnewbranch);
router.route("/get_franchise").get(auth, webposController.getfranchise);
router.route("/get_branch").get(auth, webposController.getbranch);

router.route("/get_birthday_numbers/:number").get(auth, webposController.get_birthday_numbers);
router.route("/check_birthday").get(auth, webposController.check_birthday);
router.route("/fetch_recent_customer_order").get(auth, webposController.fetch_recent_customer_order);
router.route("/fetch_last_5_customer_order").get(auth, webposController.fetch_last_5_customer_order);
router.route("/fetch_popular_items").get(auth, webposController.fetch_popular_items);
router.route("/fetch_last_10_order_customer").get(auth, webposController.fetch_last_10_order_customer);
router.route("/fetch_order_detail").get(auth, webposController.fetch_order_detail);

/*------------------------------------------------------------------------
                       Cashier Section                         
--------------------------------------------------------------------------*/
router.route("/add_cashier").post(auth, webposController.add_cashier);
/*------------------------------------------------------------------------
                       add_customer_roles                       
--------------------------------------------------------------------------*/
router.route("/add_customer_roles").post(webposController.add_customer_roles);
module.exports = router;
