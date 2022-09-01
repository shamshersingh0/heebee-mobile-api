const sequelize = require("sequelize");
const Op = sequelize.Op;
const models = require("../models");
const { employee, customer, orders, order_items, categories, product, product_list,
   franchise, branch, category_list, add_ons, add_on_option, per_product_add_ons, order_history,
   order_items_history, employee_roles, coupons, customer_roles, emp_cashier, customer_group_members, wallet_transaction, employee_logout_details
} = require("../models");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require("axios");
//const otpGenerator = require('otp-generator');

class webposController {

   /* -----------------------  Customer Section  -----------------------------*/
   // sendotpmembcust
   async sendotpmembcust(req, res) {
      try {
         const { mobile_no } = req.body;
         // Generate Random 4 digit OTP
         let MEMB_OTP = Math.floor(1000 + Math.random() * 9000);
         // var MEMB_OTP = 1234;
         // Some MEMB_OTP Service to send otp to customer mobile
         const data = await customer.update({ MEMB_OTP }, { where: { mobile_no } });
         const apistring = `https://api.msg91.com/api/v5/otp?template_id=${process.env.TEMPLATEID }&mobile=91${mobile_no}&authkey=${process.env.AUTHKEY}&otp=${MEMB_OTP}`;
         const response = await axios.get(apistring);
         console.log(data)
         // if (data) {
         if (data[0]) {
            res.json({
               status: "success",
               // data: OTP
            });
         }
         else {
            res.json({
               status: "failure",
               msg: "Customer not found!"
            });
         }
      }
      catch (e) {
         console.log(e)
         res.status(500).json({ "status": "failure", "msg": e });
      }
   }

   // sendotpcust
   async sendotpcust(req, res) {
      try {
         const { mobile_no } = req.body;
         // Generate Random 4 digit OTP
         let OTP = Math.floor(1000 + Math.random() * 9000);
         // var OTP = 1234;
         // Some OTP Service to send otp to customer mobile
         const data = await customer.update({ OTP }, { where: { mobile_no } });
         const apistring = `https://api.msg91.com/api/v5/otp?template_id=${process.env.TEMPLATEID }&mobile=91${mobile_no}&authkey=${process.env.AUTHKEY}&otp=${OTP}`;
         const response = await axios.get(apistring);
         console.log(data)
         // if (data) {
         if (data[0]) {
            res.json({
               status: "success",
               // data: OTP
            });
         }
         else {
            res.json({
               status: "failure",
               msg: "Customer not found!"
            });
         }
      }
      catch (e) {
         console.log(e)
         res.status(500).json({ "status": "failure", "msg": e });
      }
   }

   // verifyotp
   async verifyotp(req, res) {
      try {
         const { mobile_no, OTP } = req.body;
         var data;
         if (mobile_no) {
            data = await customer.findOne({
               where: {
                  mobile_no: mobile_no
               }
            });
         }
         if (data) {
            if (data.OTP == OTP) {
               res.json({
                  status: "success",
                  msg: "OTP Verified Successfully!"
               });
            }
            else {
               res.json({
                  status: "failure",
                  msg: "OTP Not Verified!"
               });
            }
         }
         else {
            res.json({
               status: "failure",
               msg: "Customer not found!"
            });
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: err
         });
      }
   }

   // verify_mem_otp
   async verify_mem_otp(req, res) {
      try {
         const { mobile_no, MEMB_OTP } = req.body;
         var data;
         if (mobile_no) {
            data = await customer.findOne({
               where: {
                  mobile_no: mobile_no
               }
            });
         }
         if (data) {
            if (data.MEMB_OTP == MEMB_OTP) {
               res.json({
                  status: "success",
                  msg: "OTP Verified Successfully!"
               });
            }
            else {
               res.json({
                  status: "failure",
                  msg: "OTP Not Verified!"
               });
            }
         }
         else {
            res.json({
               status: "failure",
               msg: "Customer not found!"
            });
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: err
         });
      }
   }

   // Register New Customer
   async newcustomer(req, res) {
      // const { first_name, last_name, profile_pic, mobile_no, email, date_of_birth, gender, branch, branch_id, shipping_address, billing_address } = req.body;
      try {
         if (!req.body.branch_id) {
            return res.json({ "status": "failure", "msg": "Please Send Branch Id!" });
         }
         if (!req.body.mobile_no) {
            return res.json({ "status": "failure", "msg": "Please Send Mobile Number!" });
         }
         const customer_exists = await customer.findOne({
            where: {
               mobile_no: req.body.mobile_no
            }
         });
         if (customer_exists) return res.json({ "status": "failure", "msg": "Customer already exists!" });
         req.body.start_date = new Date().toISOString().slice(0, 10);
         const customer_role = await customer_roles.findOne({
            offset: 1,
            order: [
               ["min_purchase", "ASC"]
            ]
         })
         // console.log(customer_role)
         req.body.memb_upg_amount = customer_role.min_purchase;
         req.body.memb_upg_categ = customer_role.customer_type;
         req.body.memb_days_left = customer_role.total_days;
         const customer_details = await customer.create(req.body);
         res.json({ "status": "success", "customer": customer_details });
      }
      catch (e) {
         console.log(e)
         res.status(500).json({ "status": "failure", "msg": e });
      }
   }

   // Add customer roles
   async add_customer_roles(req, res) {
      try {
         const data = await customer_roles.create(req.body);
         res.json({ "status": "success", "data": data });
      }
      catch (err) {
         console.log(err);
         res.status(500).json({ "status": "failure", "msg": err });
      }
   }

   // Guest Customer
   async guestcustomer(req, res) {
      try {
         const { branch_id, branch } = req.body;
         const data = await customer.create({
            first_name: "Guest",
            branch_id,
            branch
         });
         res.json({ "status": "success", "data": data });
      }
      catch (err) {
         console.log(err);
         res.status(500).json({ "status": "failure", "msg": err });
      }
   }

   // Return all customer details
   async customerinfo(req, res) {
      try {
         const mobile_no = req.query.mobile_no;
         if (mobile_no) {
            const data = await customer.findOne({
               where: {
                  mobile_no
               },
               attributes: {
                  exclude: ['createdAt', 'updatedAt']
               },
               include: {
                  model: customer_roles
               },
            });
            if (data) {
               res.json({
                  status: "success",
                  data: data
               });
            }
            else {
               res.json({
                  status: "failure",
                  msg: "customer does not exist"
               });
            }
         }
         else {
            const data = await customer.findAll({
               attributes: {
                  exclude: ['createdAt', 'updatedAt']
               }
            });
            res.json({ status: "success", data: data })
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: "no data found"
         });
      }
   }

   // Search Customer By mobile Number
   async searchcustomer(req, res) {
      try {
         const mobile_no = '%' + req.query.mobile_no + '%';
         const data = await customer.findAll({
            limit: 10,
            where: {
               mobile_no: {
                  [Op.like]: mobile_no
               }
            },
            attributes: {
               exclude: ['createdAt', 'updatedAt']
            }
         });
         if (data.length != 0) {
            res.json({
               status: "success",
               data: data
            });
         }
         else {
            res.json({
               status: "failure",
               msg: "customer does not exist"
            });
         }
      }
      catch (err) {
         console.log(err)
         return res.status(500).json({ status: "failure", msg: "no data found" });
      }
   }

   /* -----------------------  Employee Section  -----------------------------*/
   // register New Employee
   async registeremployee(req, res) {
      try {
         // const { full_name, mobile_no, profile_pic, email, date_of_birth, branch, branch_id, employee_role, employee_role_id, gender, address, device, from_ip } = req.body;

         // Check if employee exists
         const emp_exists = await employee.findOne({ where: { email: req.body.email } });
         if (emp_exists) return res.json({ "status": "failure", "msg": "Employee already exists!" });
         if (!req.body.email || !req.body.mobile_no || !req.body.mobile_no || !req.body.password || !req.body.employee_role || !req.body.employee_role_id || !req.body.branch_id || !req.body.branch || !req.body.gender) {
            return res.json({ "status": "failure", "msg": "Please send all required variables!" });
         }
         // var from_ip_ = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
         // var device_ = req.headers['user-agent'];
         // console.log(from_ip_, device_)
         // Password hashing 
         req.body.password = await bcrypt.hash(req.body.password, 10);
         const token = await jwt.sign({ email: req.body.email }, process.env.JWT_SECRET_TOKEN_SIGNATURE);
         req.body.token = token;
         const emp = await employee.create(req.body);
         res.json({
            status: "success",
            data: emp
         });
      }
      catch (e) {
         console.log(e);
         res.status(500).json({ "status": "failure", "msg": e });
      }
   }

   // get Employee Info
   async employeeinfo(req, res) {
      try {
         // Decoding token
         const decoded = await jwt.verify(req.query.token, process.env.JWT_SECRET_TOKEN_SIGNATURE);
         let data = await employee.findOne({ where: { email: decoded.email } });
         // Matching token from database table
         if (req.query.token === data.token) {
            res.json({
               status: "success",
               data: data
            });
         }
         else {
            res.json({
               status: "failure",
               msg: "Token Does Not match"
            });
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: "invalid credentials"
         });
      }

   }

   // reset Password
   async reset_password_employee(req, res) {
      let password = req.body.password;
      let employee_id = req.body.employee_id;
      try {
         password = await bcrypt.hash(password, 10);
         const data = await employee.update({
            password: password
         }, {
            where: {
               employee_id: employee_id
            }
         });
         res.json({ "status": "success", "message": "Password Reset Success" });
      }
      catch (err) {
         console.log(err);
         res.json({ "status": "failure" })
      }
   }

   // Login Employee
   async loginemployee(req, res) {
      try {
         let { email, password } = req.body;
         const emp = await employee.findOne({ where: { email } });
         if (emp) {
            const is_match = await bcrypt.compare(password, emp.password);
            if (is_match) {
               const token = await jwt.sign({ email }, process.env.JWT_SECRET_TOKEN_SIGNATURE, { expiresIn: '30d' });
               const last_logged_in = new Date();
               // storing token and updating last_logged in status
               const update_employee = await employee.update({ token, last_logged_in }, {
                  where: {
                     employee_id: emp.employee_id
                  }
               });
               const emp_login_details = await employee_logout_details.findOne({
                  where: {
                     employee_id: emp.employee_id,
                     branch_id: emp.branch_id
                  },
                  order: [["createdAt", "DESC"]],
               })
               if (emp_login_details) {
                  if (emp_login_details.log_out == null) {
                     const update_employee_logdetails = await employee_logout_details.update({ log_out: last_logged_in }, {
                        where: {
                           employee_logout_details_id: emp_login_details.employee_logout_details_id
                        }
                     });
                     const creat_emp_log = await employee_logout_details.create({
                        employee_id: emp.employee_id,
                        branch_id: emp.branch_id,
                        log_in: last_logged_in,
                        log_out: null
                     })
                  } else {
                     const creat_emp_log = await employee_logout_details.create({
                        employee_id: emp.employee_id,
                        branch_id: emp.branch_id,
                        log_in: last_logged_in,
                        log_out: null
                     })
                  }
               } else {
                  const creat_emp_log = await employee_logout_details.create({
                     employee_id: emp.employee_id,
                     branch_id: emp.branch_id,
                     log_in: last_logged_in,
                     log_out: null
                  })
               }


               res.status(200).json({ "status": "success", "token": token });
            }
            else
               res.json({ "status": "failure", "msg": "email or password wrong" });
         }
         else
            res.json({ "status": "failure", "msg": "employee does not exists" });

      } catch (err) {
         //console.log(err);
         res.status(500).json({ "error": err });
      }
   }

   async add_employee_role(req, res) {
      try {
         const data = await employee_roles.create(req.body);
         res.json({
            status: "success",
            data: data
         });
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: err
         });
      }
   }

   async logout_employee_orders(req, res) {
      try {
         var pgnum = req.params.number;
         var per_page = 10;
         if (!pgnum) {
            pgnum = 0;
         } else if (pgnum > 0) {
            pgnum = (pgnum - 1) * per_page;
         } else {
            pgnum = 0;
         }
         var init_cash;
         var emp_cash_data;

         const employee_id = req.query.employee;
         const branch_id = req.query.branch;
         const emp = await employee.findOne({ where: { employee_id } });
         var login_in_time = emp.last_logged_in;
         var logout_time = new Date();
         // logout details 
         const emp_login_details = await employee_logout_details.findOne({
            where: {
               employee_id: employee_id,
               branch_id: branch_id
            },
            order: [["createdAt", "DESC"]],
         })
         if (emp_login_details) {
            if (emp_login_details.log_out == null) {
               const update_employee_logdetails = await employee_logout_details.update({ log_out: logout_time }, {
                  where: {
                     employee_logout_details_id: emp_login_details.employee_logout_details_id
                  }
               });
            }
         }
         // count preparing orders
         var total_preparing_orders = await orders.count({
            where: {
               employee_id,
               branch_id,
               status: "Preparing",
               createdAt: {
                  [Op.between]: [login_in_time, logout_time]
               }
            }
         });
         // count hold orders
         var total_on_hold_orders = await orders.count({
            where: {
               employee_id,
               branch_id,
               status: "Hold",
               createdAt: {
                  [Op.between]: [login_in_time, logout_time]
               }
            }
         });
         // count completed orders
         var total_completed_orders = await orders.count({
            where: {
               employee_id,
               branch_id,
               status: "Completed",
               createdAt: {
                  [Op.between]: [login_in_time, logout_time]
               }
            }
         });
         // count cancelled orders
         var total_cancelled_orders = await orders.count({
            where: {
               employee_id,
               branch_id,
               status: "Cancelled",
               createdAt: {
                  [Op.between]: [login_in_time, logout_time]
               }
            }
         });
         // fetch all orders
         const all_orders = await orders.findAll({
            offset: pgnum, limit: per_page,
            where: {
               employee_id,
               branch_id,
               createdAt: {
                  [Op.between]: [login_in_time, logout_time]
               }
            },
            include: {
               model: order_items
            }
         })
         console.log("all_orders", all_orders)
         // count all orders
         var total_orders = await orders.count({
            where: {
               employee_id,
               branch_id,
               createdAt: {
                  [Op.between]: [login_in_time, logout_time]
               }
            }
         });
         if (!total_orders) total_orders = 0;
         if (!total_preparing_orders) total_preparing_orders = 0;
         if (!total_on_hold_orders) total_on_hold_orders = 0;
         if (!total_completed_orders) total_completed_orders = 0;
         if (!total_cancelled_orders) total_cancelled_orders = 0;
         var total_revenue = 0;
         var online_delivery = 0;
         var delivery_charges = 0;
         var total_revenue = 0;
         var total_cash_web = 0;
         var total_cash_card_web = 0;
         var total_money_wallet = 0;
         var total_cash_wallet = 0;
         var wallet_sales = 0;
         var init_cash = 0;
         var final_cash = 0;
         if (total_orders != 0) {

            // revenue generation exclude delivery
            var revenue_gen = await orders.sum('paid_price', {
               where: {
                  employee_id,
                  branch_id,
                  [Op.or]: [
                     { status: "Completed" },
                     { status: "Preparing" }
                  ],
                  order_type: { [Op.not]: "Delivery" },
                  createdAt: {
                     [Op.between]: [login_in_time, logout_time]
                  }
               }
            }).then(sum => {
               // will be 50
               if (sum != null) {
                  // console.log(sum)
                  total_revenue = sum
                  console.log("total_revenue", total_revenue)
               }
            })

            // total delivery revenue
            var total_delivery_online = await orders.sum('paid_price', {
               where: {
                  employee_id,
                  branch_id,
                  [Op.or]: [
                     { status: "Completed" },
                     { status: "Preparing" }
                  ],
                  order_type: "Delivery",
                  createdAt: {
                     [Op.between]: [login_in_time, logout_time]
                  }
               }
            }).then(sum => {
               // will be 50
               if (sum != null) {
                  // console.log(sum)
                  online_delivery = sum
                  console.log("online_delivery", online_delivery)
               }
            })

            // total delivery charges
            var total_delivery_charges = await orders.sum('delivery_charges', {
               where: {
                  employee_id,
                  branch_id,
                  [Op.or]: [
                     { status: "Completed" },
                     { status: "Preparing" }
                  ],
                  order_type: "Delivery",
                  createdAt: {
                     [Op.between]: [login_in_time, logout_time]
                  }
               }
            }).then(sum => {
               // will be 50
               if (sum != null) {
                  // console.log(sum)
                  delivery_charges = sum
                  console.log("delivery_charges", delivery_charges)
               }
            })

            // wallet sales
            var wallet_sales_gen = await orders.sum('paid_price', {
               where: {
                  employee_id,
                  branch_id,
                  [Op.or]: [
                     { status: "Completed" },
                     { status: "Preparing" }
                  ],
                  payment_method: "wallet",
                  order_type: { [Op.not]: "Delivery" },
                  createdAt: {
                     [Op.between]: [login_in_time, logout_time]
                  }
               }
            }).then(sum => {
               if (sum != null) {
                  wallet_sales = sum
                  console.log("wallet_sales", wallet_sales)
               }
            })

            // cash sales
            var web_cash_gen = await orders.sum('paid_price', {
               where: {
                  employee_id,
                  branch_id,
                  [Op.or]: [
                     { status: "Completed" },
                     { status: "Preparing" }
                  ],
                  payment_method: "cash",
                  order_type: { [Op.not]: "Delivery" },
                  createdAt: {
                     [Op.between]: [login_in_time, logout_time]
                  }
               }
            }).then(sum => {
               if (sum != null) {
                  total_cash_web = sum
                  console.log("total_cash_web  cash sales", total_cash_web)
               }
            })

            // cash sales from card + cash
            var web_cash_card_gen = await orders.sum('cash_amount', {
               where: {
                  employee_id,
                  branch_id,
                  [Op.or]: [
                     { status: "Completed" },
                     { status: "Preparing" }
                  ],
                  payment_method: "card + cash",
                  order_type: { [Op.not]: "Delivery" },
                  createdAt: {
                     [Op.between]: [login_in_time, logout_time]
                  }
               }
            }).then(sum => {
               if (sum != null) {
                  total_cash_card_web = sum
                  console.log("total_cash_card_web cash sales", total_cash_card_web)
               }
            })

            // wallet credits
            var wallet_revenue_gen = await wallet_transaction.sum('amount', {
               where: {
                  employee_id,
                  branch_id,
                  createdAt: {
                     [Op.between]: [login_in_time, logout_time]
                  }
               }
            }).then(sum => {
               if (sum != null) {
                  total_money_wallet = sum
                  console.log("wallet credits", total_money_wallet)
               }
            })

            //  wallet transaction from cash
            var wallet_cash_gen = await wallet_transaction.sum('amount', {
               where: {
                  payment_method: "cash",
                  employee_id,
                  branch_id,
                  createdAt: {
                     [Op.between]: [login_in_time, logout_time]
                  }
               }
            }).then(sum => {
               if (sum != null) {
                  total_cash_wallet = sum
                  console.log("total_cash_wallet wallet cash credit ", total_cash_wallet)
               }
            })
            console.log("total_revenue", total_revenue)
            if (req.query.emp_cashier_id != 'null' && req.query.emp_cashier_id != null && req.query.emp_cashier_id) {
               console.log(req.query.emp_cashier_id)
               var emp_cashier_id = req.query.emp_cashier_id
               emp_cash_data = await emp_cashier.findOne({
                  where: {
                     emp_cashier_id,
                  },
                  raw: true
               });
               var init_cash = emp_cash_data.initial_cash;
               var final_cash = (init_cash + total_cash_web + total_cash_card_web + total_cash_wallet);
               console.log(init_cash)
               const logout_time = new Date();
               const update = await emp_cashier.update({
                  total_revenue: (total_revenue),
                  final_cash: final_cash,
                  logout_time: logout_time
               }, {
                  where: {
                     emp_cashier_id
                  }
               });
               res.json({
                  status: "success",
                  total_orders: total_orders,
                  init_cash,
                  final_cash,
                  final_sales: total_revenue,
                  // total_revenue: (total_revenue + total_money_wallet),
                  // wallet_revenue: total_money_wallet,
                  wallet_credits: total_money_wallet,
                  wallet_sales: wallet_sales,
                  order_revenue: total_revenue,
                  wallet_cash: (total_cash_wallet),
                  // order_cash: (total_cash_web + total_cash_card_web),
                  cash_sales: (total_cash_web + total_cash_card_web),
                  digital_sales: (total_revenue - (total_cash_web + total_cash_card_web)),
                  total_preparing_orders: total_preparing_orders,
                  total_on_hold_orders: total_on_hold_orders,
                  total_completed_orders: total_completed_orders,
                  total_cancelled_orders: total_cancelled_orders,
                  online_delivery,
                  delivery_charges,
                  all_orders: all_orders
                  // preparing_orders:preparing_orders,
                  // on_hold_orders:on_hold_orders,
                  // completed_orders:completed_orders,
                  // cancelled_orders:cancelled_orders
               });
            } else {
               var final_cash = (init_cash + total_cash_web + total_cash_card_web + total_cash_wallet);
               console.log(init_cash)
               res.json({
                  status: "success",
                  total_orders: total_orders,
                  init_cash,
                  final_cash,
                  final_sales: total_revenue,
                  // total_revenue: (total_revenue + total_money_wallet),
                  // wallet_revenue: total_money_wallet,
                  wallet_credits: total_money_wallet,
                  wallet_sales: wallet_sales,
                  order_revenue: total_revenue,
                  wallet_cash: (total_cash_wallet),
                  // order_cash: (total_cash_web + total_cash_card_web),
                  cash_sales: (total_cash_web + total_cash_card_web),
                  digital_sales: (total_revenue - (total_cash_web + total_cash_card_web)),
                  total_preparing_orders: total_preparing_orders,
                  total_on_hold_orders: total_on_hold_orders,
                  total_completed_orders: total_completed_orders,
                  total_cancelled_orders: total_cancelled_orders,
                  online_delivery,
                  delivery_charges,
                  all_orders: all_orders
                  // preparing_orders:preparing_orders,
                  // on_hold_orders:on_hold_orders,
                  // completed_orders:completed_orders,
                  // cancelled_orders:cancelled_orders
               });
            }
         }
         else {
            console.log(login_in_time)
            // var logout_time = new Date();
            if (req.query.emp_cashier_id != 'null' && req.query.emp_cashier_id != null && req.query.emp_cashier_id) {
               console.log(req.query.emp_cashier_id)
               var emp_cashier_id = req.query.emp_cashier_id
               emp_cash_data = await emp_cashier.findOne({
                  where: {
                     emp_cashier_id,
                  },
                  raw: true
               });
               var wallet_revenue_gen = await wallet_transaction.sum('amount', {
                  where: {
                     employee_id,
                     branch_id,
                     createdAt: {
                        [Op.between]: [login_in_time, logout_time]
                     }
                  }
               }).then(sum => {
                  if (sum != null) {
                     total_money_wallet = sum
                     console.log("wallet credits", total_money_wallet)
                  }
               })

               var wallet_cash_gen = await wallet_transaction.sum('amount', {
                  where: {
                     payment_method: "cash",
                     employee_id,
                     branch_id,
                     createdAt: {
                        [Op.between]: [login_in_time, logout_time]
                     }
                  }
               }).then(sum => {
                  if (sum != null) {
                     total_cash_wallet = sum
                     console.log("total_cash_wallet wallet cash credit ", total_cash_wallet)
                  }
               })
               var init_cash = emp_cash_data.initial_cash;
               var final_cash = (init_cash + total_cash_wallet);
               console.log(init_cash)
               // const logout_time = new Date();
               const update = await emp_cashier.update({
                  total_revenue: (total_revenue + total_money_wallet),
                  final_cash: final_cash,
                  logout_time: logout_time
               }, {
                  where: {
                     emp_cashier_id
                  }
               });
               res.json({
                  status: "success",
                  total_orders: total_orders,
                  init_cash,
                  final_cash,
                  final_sales: total_revenue,
                  // total_revenue: (total_revenue + total_money_wallet),
                  // wallet_revenue: total_money_wallet,
                  wallet_credits: total_money_wallet,
                  wallet_sales: wallet_sales,
                  order_revenue: total_revenue,
                  wallet_cash: (total_cash_wallet),
                  // order_cash: (total_cash_web + total_cash_card_web),
                  cash_sales: (total_cash_web + total_cash_card_web),
                  digital_sales: (total_revenue - (total_cash_web + total_cash_card_web)),
                  total_preparing_orders: total_preparing_orders,
                  total_on_hold_orders: total_on_hold_orders,
                  total_completed_orders: total_completed_orders,
                  total_cancelled_orders: total_cancelled_orders,
                  online_delivery,
                  delivery_charges,
                  all_orders: all_orders
                  // preparing_orders:preparing_orders,
                  // on_hold_orders:on_hold_orders,
                  // completed_orders:completed_orders,
                  // cancelled_orders:cancelled_orders
               });
            } else {
               res.json({
                  status: "failure",
                  msg: "No Orders Found"
               });
            }


         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: err
         });
      }
   }

   // add_cashier
   async add_cashier(req, res) {
      try {
         req.body.logged_in_time = new Date();
         const data = await emp_cashier.create(req.body);
         if (data) {
            res.json({
               status: "success",
               data: data
            });
         }
         else {
            res.json({
               status: "failure",
               msg: "no data found"
            });
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: err
         });
      }
   }

   /* -----------------------   Category Section -----------------------------*/

   // Add new Category
   async addcategory(req, res) {
      try {
         const { category_name, description, card_img, branch_id } = req.body;
         // Adding New category in category list
         const new_category = await category_list.create({
            category_name,
            description,
            card_img
         });
         //console.log(new_category);
         // add branch id and and category list id in category table
         const category_list_id = new_category.category_list_id;
         const data = await categories.create({
            category_list_id,
            branch_id
         });
         res.json({ "status": "success", "data": data });
      }
      catch (err) {
         console.log(err);
         res.status(500).json({ "status": "failure", "msg": err });
      }
   }

   // Get All Categories
   async getallcategories(req, res) {
      try {
         const data = await categories.findAll({ include: category_list });
         res.json({ "status": "success", "data": data });
      }
      catch (err) {
         console.log(err);
         res.status(500).json({ "status": "failure", "msg": "no data found" });
      }
   }

   // Get Single category
   async getsinglecategory(req, res) {
      try {
         const category_id = req.query.category;
         const data = await categories.findOne({
            where: {
               category_id: category_id
            },
            include: {
               model: category_list
            }
         });
         const total_product = await product.count({
            where: {
               category_id
            }
         })
         if (data) {
            res.json({
               status: "success",
               data: data,
               total_product
            });
         }
         else {
            res.json({
               status: "failure",
               msg: "no data found"
            });
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: "no data found"
         });
      }
   }

   // Get Category by branch
   async get_category_by_branch(req, res) {
      try {
         const branch_id = req.query.branch;
         // Return data by branch if branch id exists
         if (branch_id) {
            const data = await branch.findOne({
               where: {
                  branch_id: branch_id
               },
               include: [{
                  model: categories,
                  include: {
                     model: category_list
                  }
               }]
            });
            if (data) {
               res.json({ "status": "success", "data": data })
            }
            else {
               res.json({ "status": "failure", "message": "Branch Not Found" });
            }
         }
         else {
            // Return all Data
            const data = await branch.findAll({
               include: {
                  model: categories,
                  include: {
                     model: category_list
                  }
               }
            });
            res.json({
               status: "success",
               data: data
            });
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            "status": "failure",
            msg: "no data found"
         });
      }
   }

   /* -----------------------  Products Section -----------------------------*/

   // Add New Product
   async addnewproduct(req, res) {
      try {
         const { branch_id, product_name, description, product_type, items_available,
            prepare_time, food_type, price, sku, card_img, status, category_id,
            add_ons_id } = req.body
         // Adding new Product details in product list table
         const new_product = await product_list.create({
            product_name,
            sku,
            description,
            card_img,
            price,
            prepare_time,
            food_type,
            product_type,
            add_ons_id
         });
         // adding branch id and product category id in product list table
         const product_list_id = new_product.product_list_id;
         const data = await product.create({
            price,
            product_list_id,
            branch_id,
            items_available,
            category_id,
            status
         });
         res.json({ "status": "success", "data": data });
      }
      catch (err) {
         console.log(err);
         res.status(500).json({ "status": "failure", "msg": err });
      }
   }

   // Get All Products
   async getallproducts(req, res) {
      try {
         const data = await product.findAll({
            where: {
               items_available: {
                  [Op.gt]: 0
               }
            },
            include: {
               model: product_list,
               include: {
                  model: per_product_add_ons,
                  separate: true,
                  include: {
                     model: add_ons,
                     include: {
                        model: add_on_option
                     }
                  }
               }
            },
            attributes: { exclude: ["createdAt", "updatedAt"] }
         });
         const total_product = await product.count({
            where: {
               items_available: {
                  [Op.gt]: 0
               }
            }
         });
         res.json({
            status: "success",
            data: data,
            total_product
         });
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: "no data found"
         });
      }
   }

   // del_cat
   async del_cat(req, res) {
      try {
         var category_list_id = req.query.category_list_id
         var res1 = await category_list.findAll({
            where: {
               category_list_id
            }
         })
         var res2 = await categories.findAll({
            where: {
               category_list_id
            },
            include: { model: product }
         })
         res.status(200).json({
            status: "success",
            res1,
            res2
         });
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: err
         });
      }
   }
   // search order
   async search_order(req, res) {
      try {
         var pgnum = req.params.number;
         var per_page = 10;
         if (!pgnum) {
            pgnum = 0;
         } else if (pgnum > 0) {
            pgnum = (pgnum - 1) * per_page;
         } else {
            pgnum = 0;
         }
         const search = req.query.search;
         const seperatedQuery = search
            .split(" ")
            .map((item) => `%${item}%`);
         const data = await orders.findAll({
            offset: pgnum, limit: per_page,
            where: {
               [Op.and]: {
                  [Op.or]: {
                     order_id: {
                        [Op.like]: {
                           [Op.any]: seperatedQuery
                        },
                     },
                     customer_no: {
                        [Op.like]: {
                           [Op.any]: seperatedQuery
                        },
                     },
                  },
               }
            }
         });
         const total_orders = await orders.count({
            where: {
               [Op.and]: {
                  [Op.or]: {
                     order_id: {
                        [Op.like]: {
                           [Op.any]: seperatedQuery
                        },
                     },
                     customer_no: {
                        [Op.like]: {
                           [Op.any]: seperatedQuery
                        },
                     },
                  },
               }
            }
         });
         if (data.length != 0) {
            res.json({
               status: "success",
               total_orders: total_orders,
               data: data,
            });
         }
         else {
            res.json({
               status: "failure",
               data: "No data found"
            });
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: err
         });
      }
   }


   // get Single Product
   async get_single_product(req, res) {
      try {
         const product_id = req.query.product;
         const data = await product.findOne({
            where: {
               product_id,
            },
            include: {
               model: product_list,
               include: {
                  model: per_product_add_ons,
                  separate: true,
                  include: {
                     model: add_ons,
                     include: {
                        model: add_on_option
                     }
                  }
               }
            },
            attributes: { exclude: ["createdAt", "updatedAt"] }
         });

         if (data) {
            res.json({
               status: "success",
               data: data
            });
         }
         else {
            res.json({
               status: "failure",
               msg: "no product found"
            });
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: "no product found"
         });
      }
   }

   // get Products (page no,category id,search api)
   async get_products(req, res) {
      try {
         const branch_id = req.query.branch;
         var pgnum = req.params.number;
         var per_page = 10;
         if (!pgnum) {
            pgnum = 0;
         } else if (pgnum > 0) {
            pgnum = (pgnum - 1) * per_page;
         } else {
            pgnum = 0;
         }
         if (req.query.search) {
            var search = req.query.search;
            const seperatedQuery = search
               .split(" ")
               .map((item) => `%${item}%`);
            console.log(seperatedQuery)

            const results = await product.findAll({
               offset: pgnum, limit: per_page,
               where: {
                  branch_id
               },
               //raw: true,
               include: {
                  model: product_list,
                  //raw: true,
                  include: {
                     model: per_product_add_ons,
                     //raw: true,
                     attributes: { exclude: ["createdAt", "updatedAt"] },
                     separate: true,
                     include: {
                        model: add_ons,
                        //raw: true,
                        include: {
                           model: add_on_option
                        }
                     },
                  },
                  where: {
                     [Op.and]: {
                        [Op.or]: {
                           product_name: {
                              [Op.iLike]: {
                                 [Op.any]: seperatedQuery,
                              },
                           },
                           sku: {
                              [Op.iLike]: {
                                 [Op.any]: seperatedQuery,
                              },
                           },
                        },
                        status: true
                     }
                  }
               },
               attributes: { exclude: ["createdAt", "updatedAt"] },
            });
            //console.log("length ",results.length);
            const total_product = await product.count({
               where: {
                  branch_id
               },
               include: {
                  model: product_list,
                  where: {
                     [Op.and]: {
                        [Op.or]: {
                           product_name: {
                              [Op.iLike]: {
                                 [Op.any]: seperatedQuery,
                              },
                           },
                           sku: {
                              [Op.iLike]: {
                                 [Op.any]: seperatedQuery,
                              },
                           },
                        },
                        status: true
                     }
                  }
               },
               attributes: { exclude: ["createdAt", "updatedAt"] },
            });
            if (results.length != 0) {
               return res.json({
                  status: "success",
                  data: results,
                  per_page,
                  total_product
               });
            } else {
               res.json({
                  status: "failure",
                  msg: "No Product Found",
               });
            }

         } else if (req.query.category) {
            const category_id = req.query.category;
            const results = await product.findAll({
               offset: pgnum, limit: per_page,
               where: {
                  category_id,
                  branch_id
               },
               // raw:true,
               include: {
                  model: product_list,
                  //  raw: true,
                  include: {
                     model: per_product_add_ons,
                     //raw: true,
                     attributes: { exclude: ["createdAt", "updatedAt"] },
                     separate: true,
                     include: {
                        model: add_ons,
                        //raw: true,
                        include: {
                           model: add_on_option
                        }
                     },
                  },
                  where: {
                     status: true
                  }
               },
               attributes: { exclude: ["createdAt", "updatedAt"] },
            });

            const total_product = await product.count({
               where: { category_id, branch_id },
               include: {
                  model: product_list,
                  where: {
                     status: true
                  }
               }
            });
            if (results.length != 0) {
               return res.json({
                  status: "success",
                  data: results,
                  per_page,
                  total_product
               });
            } else {
               res.json({
                  status: "failure",
                  msg: "No Product Found",
               });
            }
         } else {
            const results = await product.findAll({
               offset: pgnum, limit: per_page,
               where: { branch_id },
               //raw:true,
               include: {
                  model: product_list,
                  //raw: true,
                  include: {
                     model: per_product_add_ons,
                     // raw: true,
                     attributes: { exclude: ["createdAt", "updatedAt"] },
                     separate: true,
                     include: {
                        model: add_ons,
                        //raw: true,
                        include: {
                           model: add_on_option
                        }
                     },
                  },
                  where: {
                     status: true
                  }
               },
               attributes: { exclude: ["createdAt", "updatedAt"] },
            });
            const total_product = await product.count({
               where: { branch_id }
            });

            if (results.length != 0) {
               return res.json({
                  status: "success",
                  data: results,
                  per_page,
                  total_product
               });
            } else {
               res.json({
                  status: "failure",
                  msg: "No Product Found",
               });
            }
         }
      }
      catch (err) {
         console.log(err);
         res.json({
            status: "failure",
            message: "no data found",
         });
      }
   }

   async get_product_by_branch(req, res) {
      try {
         const branch_id = req.query.branch;
         const data = await product.findAll({
            where: {
               branch_id
            },

            include: {
               model: product_list,
               include: {
                  model: per_product_add_ons,
                  attributes: { exclude: ["createdAt", "updatedAt"] },
                  separate: true,
                  include: {
                     model: add_ons,
                     include: {
                        model: add_on_option
                     }
                  }
               },
               where: {
                  status: true
               }
            },
            attributes: { exclude: ["createdAt", "updatedAt"] }
         });
         const total_product = data.length;
         if (data.length != 0) {
            res.json({
               status: "success",
               data: data,
               total_product
            });
         }
         else {
            res.json({
               status: "success",
               msg: "no data found"
            });
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: "no data found"
         });
      }
   }

   async add_options(req, res) {
      try {
         const data = await add_on_option.create(req.body);
         res.json("success");
      }
      catch (err) {
         console.log(err);
      }
   }
   // add Add ons
   async add_addon(req, res) {
      try {
         const { title, product_list_id, add_ons_id, add_on_options } = req.body;

         if (add_ons_id && product_list_id) {
            const per_product = await per_product_add_ons.create({ product_list_id, add_ons_id });
            res.json({ "status": "success", "data": per_product });
         }
         else {
            const new_addon = await add_ons.create({ title });
            const add_ons_id = new_addon.add_ons_id;
            for (var i = 0; i < add_on_options.length; i++) {
               const data = await add_on_option.create({
                  add_ons_id: add_ons_id,
                  title: add_on_options[i].title,
                  price: add_on_options[i].price,
                  order: add_on_options[i].order,
                  sku: add_on_options[i].sku
               });
            }
            res.json({ "status": "success", "data": new_addon });
         }

      }
      catch (err) {
         console.log(err);
         res.status(500).json({ "status": "failure", "msg": err });
      }
   }

   /* -----------------------  Franchise And Branches Section -----------------------------*/

   // Add New franchise
   async addfranchise(req, res) {
      try {
         const { location, franchise_name, no_branches } = req.body;
         const franchise_info = await franchise.create({ franchise_name, location, no_branches });
         res.json({ "status": "success", "data": franchise_info })
      }
      catch (err) {
         console.log(err);
         res.status(500).json({ "status": "failure", "msg": err });
      }
   }

   // get Franchise Information
   async getfranchise(req, res) {
      try {
         const franchise_id = req.query.franchise;
         if (franchise_id) {
            const data = await franchise.findOne({
               where: {
                  franchise_id
               },
               include: branch
            });
            if (data) {
               res.json({
                  status: "success",
                  data: data
               });
            }
            else {
               res.json({
                  status: "failure",
                  msg: "no data found"
               });
            }
         }
         else {
            const data = await franchise.findAll({ include: { model: branch } });
            res.json({
               status: "success",
               data: data
            });
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: "no data found"
         });
      }
   }

   // Get Branch info
   async getbranch(req, res) {
      try {
         const branch_id = req.query.branch;
         if (branch_id) {
            const data = await branch.findOne({
               where: {
                  branch_id
               },
               attributes: {
                  exclude: ["createdAt", "updatedAt"]
               }
            });
            if (data) {
               res.json({
                  status: "success",
                  data: data
               })
            }
            else {
               res.json({
                  status: "failure",
                  msg: "branch details not found"
               })
            }
         }
         else {
            const data = await branch.findAll({
               attributes: {
                  exclude: ["createdAt", "updatedAt"]
               }
            });
            res.json({ status: "success", data: data });
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: "no data found"
         });
      }
   }

   // Add New Branch
   async addnewbranch(req, res) {
      try {
         const { branch_name, city, region, address, franchise_id } = req.body;
         const data = await branch.create({ branch_name, city, region, address, franchise_id });
         res.json({ "status": "success", "data": data })
      }
      catch (err) {
         console.log(err);
         res.status(500).json({ "status": "failure", "msg": err });
      }
   }

   /* -------------------------------- Checkout Order Section -------------------------- */

   async checkout_order(req, res) {
      try {
         var order_id;
         const { customer_no, employee_id, branch_id, branch_name, paid_price, sub_total, discount,
            applied_coupons, comment, status, paid, tax, payment_method, payment_id, account_id, received, change, order_type, address, cash_amount, card_amount, sgst, cgst, membership_discount } = req.body;
         // console.log(payment_method, payment_id, account_id)
         let order_items_array = req.body.order_items;
         const total_items = order_items_array.length;
         var ord_rec_time = null;
         if (req.body.ord_rec_time) {
            ord_rec_time = req.body.ord_rec_time;
         }
         var bypass_otp = false;
         if (req.body.bypass_otp) {
            bypass_otp = req.body.bypass_otp;
         }
         var delivery_charges = 0;
         if (req.body.delivery_charges) {
            delivery_charges = req.body.delivery_charges;
         }
         // Generating Order id
         const year = new Date().getFullYear();
         const recent = await orders.findOne({
            order: [["createdAt", "DESC"]],
            attributes: ["order_id"]
         });
         if (!recent) {
            order_id = `POS${year}00000001`;
         } else {
            const recent_id = `${parseInt(recent.order_id.slice(7)) + 1}`;
            console.log("id ", recent_id);
            const places = 8 - recent_id.length;
            console.log("places ", places);
            var padZeros = ""
            if (places > 0) for (var i = 0; i < places; i++) padZeros += "0";  // Padding zeros
            order_id = `POS${year}${padZeros}${recent_id}`;
         }

         // customer_membership
         if (customer_no != null && paid == true) {
            const cust = await customer.findOne({
               where: {
                  mobile_no: customer_no
               }
            })
            // Find customer and check Permanent category variable true or false
            if (cust && (cust.perma_cat != true)) {
               if (payment_method == "wallet") {
                  cust.wallet_balance = (cust.wallet_balance) - parseInt(paid_price)
               }
               var Difference_In_Time;
               var days_diff;
               var date2 = new Date()
               var init_date = cust.start_date
               var date1 = new Date(init_date);
               // diff in time to find days
               var Difference_In_Time = (date2 - date1)
               // To calculate the no. of days between two dates
               var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
               // console.log("diff", parseInt(Difference_In_Days))
               // days diff in Int
               var days_diff = parseInt(Difference_In_Days)
               // Fetch All Customer Roles
               let customer_role = await customer_roles.findAll({
                  order: [
                     ["min_purchase", "ASC"]
                  ],
                  raw: true
               })
               // find index of customer current role
               var pos = customer_role.findIndex(i => i.customer_type == cust.customer_type);
               console.log("pos", pos)
               // mem days limit
               var memb_day_limit = customer_role[pos].total_days;
               console.log("memb_day_limit", memb_day_limit)
               // customer_current_role
               var current_role = customer_role[pos]
               console.log("current_role", current_role)
               // remove element from customer role array before curent role index and add into new array 
               var new_array = customer_role.splice(0, (pos + 1));
               console.log("customer_role", customer_role)
               console.log("new_array", new_array)
               // Points contain elements that user can upgrade to
               const points = customer_role;
               console.log("points", points)
               // descending order of elements of points array so we start match from large values
               points.sort(function (a, b) { return ((b.min_purchase) - (a.min_purchase)) }); console.log(days_diff <= memb_day_limit)
               // if days differencr less then memb days limit it means memb can upgrade and maintain role
               if (days_diff <= memb_day_limit) {
                  // it means he is at Platinum or biggest level
                  if (points.length == 0) {
                     // if current role reduction price is greater then spend money
                     if ((current_role.reduce_purchase) > (cust.memb_amount + paid_price)) {
                        cust.memb_reduce_amount = ((current_role.reduce_purchase) - (cust.memb_amount + paid_price));
                        cust.memb_days_left = (memb_day_limit - days_diff);
                        cust.memb_amount = (cust.memb_amount + paid_price)
                     } else {
                        // if current role reduction price is less then spend money means can stay platinm customer
                        cust.memb_reduce_amount = current_role.reduce_purchase;
                        cust.memb_amount = 0;
                        cust.start_date = new Date().toISOString().slice(0, 10);
                        cust.memb_days_left = (memb_day_limit);
                     }
                     cust.memb_upg_amount = current_role.upg_purchase;
                     cust.customer_type = current_role.customer_type;
                     cust.memb_upg_categ = null;
                     await cust.save();
                  } else {
                     // means can upgrade
                     // finding role if upgrade or not
                     var pos2 = points.findIndex(i => ((i.min_purchase - current_role.min_purchase) <= (cust.memb_amount + paid_price)));
                     console.log("pos2", pos2)
                     // if means customer spend money more then need for upgrade
                     if (pos2 > -1) {
                        // if points have upgrade more then one stage
                        if (points[pos2 - 1]) {
                           console.log("1points[pos2 - 1]", points[pos2 - 1])
                           cust.memb_upg_amount = points[pos2].upg_purchase;
                           cust.memb_reduce_amount = points[pos2].reduce_purchase;
                           cust.customer_type = points[pos2].customer_type;
                           cust.memb_upg_categ = points[pos2 - 1].customer_type;
                           cust.memb_days_left = points[pos2].total_days;
                           cust.memb_amount = 0
                           cust.start_date = new Date().toISOString().slice(0, 10);
                           await cust.save();
                        } else {
                           // means at top
                           console.log("else2",)

                           if (((points[pos2].min_purchase) - (current_role.min_purchase)) == 0) {
                              if ((points[pos2].reduce_purchase) > (cust.memb_amount + paid_price)) {
                                 cust.memb_reduce_amount = ((points[pos2].reduce_purchase) - (cust.memb_amount + paid_price));
                              } else {
                                 cust.memb_reduce_amount = 0;
                              }
                              cust.memb_upg_amount = points[pos2].upg_purchase;
                              cust.customer_type = points[pos2].customer_type;
                              cust.memb_upg_categ = null;
                              cust.memb_days_left = (memb_day_limit - days_diff);
                              cust.memb_amount = (cust.memb_amount + paid_price)
                              await cust.save();
                           } else {
                              cust.memb_upg_amount = points[pos2].upg_purchase;
                              cust.memb_reduce_amount = points[pos2].reduce_purchase;
                              cust.customer_type = points[pos2].customer_type;
                              cust.memb_upg_categ = null;
                              cust.memb_days_left = points[pos2].total_days;
                              cust.memb_amount = 0
                              cust.start_date = new Date().toISOString().slice(0, 10);
                              await cust.save();
                           }
                        }
                     } else {
                        if ((cust.memb_amount + paid_price) >= current_role.reduce_purchase) {
                           cust.memb_upg_amount = current_role.upg_purchase - (cust.memb_amount + paid_price);
                           cust.memb_reduce_amount = 0;
                           cust.memb_days_left = (memb_day_limit - days_diff);
                           cust.memb_amount = (cust.memb_amount + paid_price)
                           await cust.save();
                        } else {
                           cust.memb_upg_amount = current_role.upg_purchase - (cust.memb_amount + paid_price);
                           cust.memb_reduce_amount = (current_role.reduce_purchase - (cust.memb_amount + paid_price));
                           cust.memb_days_left = (memb_day_limit - days_diff);
                           cust.memb_amount = (cust.memb_amount + paid_price)
                           await cust.save();
                        }
                     }
                  }
               } else {
                  if (points.length == 0) {
                     console.log("new")
                     if ((current_role.reduce_purchase) > (paid_price)) {
                        if (((new_array[new_array.length - 2].reduce_purchase) > (paid_price))) {
                           cust.memb_reduce_amount = ((new_array[new_array.length - 2].reduce_purchase) - (paid_price));
                        } else {
                           cust.memb_reduce_amount = 0;
                        }

                        cust.memb_days_left = (new_array[new_array.length - 2].total_days);
                        cust.start_date = new Date().toISOString().slice(0, 10);
                        cust.memb_amount = (paid_price)
                        cust.memb_upg_amount = new_array[new_array.length - 2].upg_purchase;
                        cust.customer_type = new_array[new_array.length - 2].customer_type;
                        cust.memb_upg_categ = current_role.customer_type;
                        await cust.save();
                     } else {
                        cust.memb_reduce_amount = current_role.reduce_purchase;
                        cust.memb_amount = 0;
                        cust.start_date = new Date().toISOString().slice(0, 10);
                        cust.memb_days_left = (memb_day_limit);
                        cust.memb_upg_amount = current_role.upg_purchase;
                        cust.customer_type = current_role.customer_type;
                        cust.memb_upg_categ = null;
                        await cust.save();
                     }
                  } else {
                     if (pos == 0) {
                        var pos2 = points.findIndex(i => ((i.min_purchase - current_role.min_purchase) <= (paid_price)));
                        if (pos2 > -1) {
                           if (points[pos2 - 1]) {
                              console.log("points[pos2 - 1]", points[pos2 + 1])
                              cust.memb_upg_amount = points[pos2].upg_purchase;
                              cust.memb_reduce_amount = points[pos2].reduce_purchase;
                              cust.customer_type = points[pos2].customer_type;
                              cust.memb_upg_categ = points[pos2 - 1].customer_type;
                              cust.memb_days_left = points[pos2].total_days;
                              cust.memb_amount = 0
                              cust.start_date = new Date().toISOString().slice(0, 10);
                              await cust.save();
                           } else {
                              cust.memb_upg_amount = points[pos2].upg_purchase;
                              cust.memb_reduce_amount = points[pos2].reduce_purchase;
                              cust.customer_type = points[pos2].customer_type;
                              cust.memb_upg_categ = null;
                              cust.memb_days_left = points[pos2].total_days;
                              cust.memb_amount = 0
                              cust.start_date = new Date().toISOString().slice(0, 10);
                              await cust.save();
                           }
                        } else {
                           if ((paid_price) >= current_role.reduce_purchase) {
                              cust.memb_upg_amount = current_role.upg_purchase - (paid_price);
                              cust.memb_reduce_amount = 0;
                              cust.memb_days_left = current_role.total_days;
                              cust.start_date = new Date().toISOString().slice(0, 10);
                              cust.memb_amount = (paid_price)
                              await cust.save();
                           } else {
                              cust.memb_upg_amount = current_role.upg_purchase - (paid_price);
                              cust.memb_reduce_amount = (current_role.reduce_purchase - (paid_price));
                              cust.memb_days_left = current_role.total_days;
                              cust.start_date = new Date().toISOString().slice(0, 10);
                              cust.memb_amount = (paid_price)
                              await cust.save();
                           }
                        }
                     } else {
                        var pos2 = points.findIndex(i => ((i.min_purchase - current_role.min_purchase) <= (paid_price)));
                        if (pos2 > -1) {
                           if (points[pos2 - 1]) {
                              cust.memb_upg_amount = points[pos2].upg_purchase;
                              cust.memb_reduce_amount = points[pos2].reduce_purchase;
                              cust.customer_type = points[pos2].customer_type;
                              cust.memb_upg_categ = points[pos2 - 1].customer_type;
                              cust.memb_days_left = points[pos2].total_days;
                              cust.memb_amount = 0
                              cust.start_date = new Date().toISOString().slice(0, 10);
                              await cust.save();
                           } else {
                              cust.memb_upg_amount = points[pos2].upg_purchase;
                              cust.memb_reduce_amount = points[pos2].reduce_purchase;
                              cust.customer_type = points[pos2].customer_type;
                              cust.memb_upg_categ = null;
                              cust.memb_days_left = points[pos2].total_days;
                              cust.memb_amount = 0
                              cust.start_date = new Date().toISOString().slice(0, 10);
                              await cust.save();
                           }
                        } else {
                           if ((paid_price) >= new_array[pos - 1].reduce_purchase) {
                              cust.memb_upg_amount = new_array[pos - 1].upg_purchase;
                              cust.memb_reduce_amount = 0;
                              cust.customer_type = new_array[pos - 1].customer_type;
                              cust.memb_upg_categ = new_array[pos].customer_type;
                              cust.memb_days_left = new_array[pos - 1].total_days;
                              cust.memb_amount = paid_price
                              cust.start_date = new Date().toISOString().slice(0, 10);
                              await cust.save();
                           } else {
                              cust.memb_upg_amount = new_array[pos - 1].upg_purchase;
                              cust.memb_reduce_amount = ((new_array[pos - 1].reduce_purchase) - (paid_price));
                              cust.customer_type = new_array[pos - 1].customer_type;
                              cust.memb_upg_categ = new_array[pos].customer_type;
                              cust.memb_days_left = new_array[pos - 1].total_days;
                              cust.memb_amount = paid_price
                              cust.start_date = new Date().toISOString().slice(0, 10);
                              await cust.save();
                           }
                        }
                     }
                  }
               }
            }
         }
         // Add data in orders Table
         const newOrder = await orders.create({
            order_id,
            customer_no,
            employee_id,
            branch_id,
            branch_name,
            total_items,
            paid_price,
            sub_total,
            tax,
            discount,
            applied_coupons,
            comment,
            status,
            paid,
            payment_method,
            payment_id,
            account_id,
            received,
            change,
            order_type,
            address,
            ord_rec_time,
            order_from: "WebPos",
            cash_amount,
            card_amount,
            sgst,
            cgst,
            membership_discount,
            bypass_otp,
            delivery_charges
         });
         const newHistoryOrder = await order_history.create({
            order_id,
            customer_no,
            employee_id,
            branch_id,
            branch_name,
            total_items,
            paid_price,
            sub_total,
            tax,
            discount,
            applied_coupons,
            comment,
            status,
            paid,
            payment_method,
            payment_id,
            account_id,
            received,
            change,
            order_type,
            address,
            ord_rec_time,
            order_from: "WebPos",
            cash_amount,
            card_amount,
            sgst,
            cgst,
            membership_discount,
            bypass_otp,
            delivery_charges
         });
         const order_history_id = newHistoryOrder.order_history_id;
         // Add all items in orderItems Table with current order ID
         for (var i = 0; i < total_items; i++) {
            const products_data = await product.findOne({
               where: {
                  product_id: order_items_array[i].product_id
               },
               // raw:true
            })
            if (products_data) {
               var quantity = parseInt(order_items_array[i].quantity)
               var items = parseInt(order_items_array[i].quantity)
               quantity = (parseInt(products_data.no_of_order) + quantity)
               items = (parseInt(products_data.items_available) - items)
               if (items < 0) {
                  items = 0;
               }
               console.log("products_data", products_data.no_of_order)
               console.log(order_items_array[i].quantity)
               console.log(items)
               products_data.no_of_order = quantity;
               products_data.items_available = items;
               await products_data.save();
            }
            const new_item = await order_items.create({
               order_id: order_id,
               branch_id: branch_id,
               product_id: order_items_array[i].product_id,
               product_name: order_items_array[i].product_name,
               quantity: order_items_array[i].quantity,
               price: order_items_array[i].price,
               add_ons: order_items_array[i].add_ons,
               discount: order_items_array[i].discount,
               product_type: order_items_array[i].product_type,
               prepare_time: order_items_array[i].prepare_time,
               food_type: order_items_array[i].food_type,
               order_sku: order_items_array[i].order_sku,
               comment: order_items_array[i].comment,
               add_ons_price: order_items_array[i].add_ons_price,
               total_price: order_items_array[i].total_price,
            });
            const order_items_id = new_item.order_items_id;
            const new_history_item = await order_items_history.create({
               order_history_id: order_history_id,
               order_items_id: order_items_id,
               branch_id: branch_id,
               product_id: order_items_array[i].product_id,
               product_name: order_items_array[i].product_name,
               quantity: order_items_array[i].quantity,
               price: order_items_array[i].price,
               add_ons: order_items_array[i].add_ons,
               discount: order_items_array[i].discount,
               product_type: order_items_array[i].product_type,
               prepare_time: order_items_array[i].prepare_time,
               food_type: order_items_array[i].food_type,
               order_sku: order_items_array[i].order_sku,
               comment: order_items_array[i].comment,
               add_ons_price: order_items_array[i].add_ons_price,
               total_price: order_items_array[i].total_price,
            });
         }
         res.json({
            status: "success",
            data: newOrder
         });
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: err
         });
      }
   }

   async update_hold_order(req, res) {
      try {
         const order_id = req.body.order_id;
         const { customer_no, employee_id, branch_id, branch_name, paid_price, sub_total, discount,
            applied_coupons, comment, status, paid, tax, payment_method, payment_id, account_id, received, change, order_type, address, cash_amount, card_amount, sgst, cgst, membership_discount } = req.body;
         var bypass_otp = false;
         if (req.body.bypass_otp) {
            bypass_otp = req.body.bypass_otp;
         }
         var delivery_charges = 0;
         if (req.body.delivery_charges) {
            delivery_charges = req.body.delivery_charges;
         }
         // customer_membership
         if (customer_no != null && paid == true) {
            const cust = await customer.findOne({
               where: {
                  mobile_no: customer_no
               }
            })
            // Find customer and check Permanent category variable true or false
            if (cust && (cust.perma_cat != true)) {
               if (payment_method == "wallet") {
                  cust.wallet_balance = (cust.wallet_balance) - parseInt(paid_price)
               }
               var Difference_In_Time;
               var days_diff;
               var date2 = new Date()
               var init_date = cust.start_date
               var date1 = new Date(init_date);
               // diff in time to find days
               var Difference_In_Time = (date2 - date1)
               // To calculate the no. of days between two dates
               var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
               // console.log("diff", parseInt(Difference_In_Days))
               // days diff in Int
               var days_diff = parseInt(Difference_In_Days)
               // Fetch All Customer Roles
               let customer_role = await customer_roles.findAll({
                  order: [
                     ["min_purchase", "ASC"]
                  ],
                  raw: true
               })
               // find index of customer current role
               var pos = customer_role.findIndex(i => i.customer_type == cust.customer_type);
               console.log("pos", pos)
               // mem days limit
               var memb_day_limit = customer_role[pos].total_days;
               console.log("memb_day_limit", memb_day_limit)
               // customer_current_role
               var current_role = customer_role[pos]
               console.log("current_role", current_role)
               // remove element from customer role array before curent role index and add into new array 
               var new_array = customer_role.splice(0, (pos + 1));
               console.log("customer_role", customer_role)
               console.log("new_array", new_array)
               // Points contain elements that user can upgrade to
               const points = customer_role;
               console.log("points", points)
               // descending order of elements of points array so we start match from large values
               points.sort(function (a, b) { return ((b.min_purchase) - (a.min_purchase)) }); console.log(days_diff <= memb_day_limit)
               // if days differencr less then memb days limit it means memb can upgrade and maintain role
               if (days_diff <= memb_day_limit) {
                  // it means he is at Platinum or biggest level
                  if (points.length == 0) {
                     // if current role reduction price is greater then spend money
                     if ((current_role.reduce_purchase) > (cust.memb_amount + paid_price)) {
                        cust.memb_reduce_amount = ((current_role.reduce_purchase) - (cust.memb_amount + paid_price));
                        cust.memb_days_left = (memb_day_limit - days_diff);
                        cust.memb_amount = (cust.memb_amount + paid_price)
                     } else {
                        // if current role reduction price is less then spend money means can stay platinm customer
                        cust.memb_reduce_amount = current_role.reduce_purchase;
                        cust.memb_amount = 0;
                        cust.start_date = new Date().toISOString().slice(0, 10);
                        cust.memb_days_left = (memb_day_limit);
                     }
                     cust.memb_upg_amount = current_role.upg_purchase;
                     cust.customer_type = current_role.customer_type;
                     cust.memb_upg_categ = null;
                     await cust.save();
                  } else {
                     // means can upgrade
                     // finding role if upgrade or not
                     var pos2 = points.findIndex(i => ((i.min_purchase - current_role.min_purchase) <= (cust.memb_amount + paid_price)));
                     console.log("pos2", pos2)
                     // if means customer spend money more then need for upgrade
                     if (pos2 > -1) {
                        // if points have upgrade more then one stage
                        if (points[pos2 - 1]) {
                           console.log("1points[pos2 - 1]", points[pos2 - 1])
                           cust.memb_upg_amount = points[pos2].upg_purchase;
                           cust.memb_reduce_amount = points[pos2].reduce_purchase;
                           cust.customer_type = points[pos2].customer_type;
                           cust.memb_upg_categ = points[pos2 - 1].customer_type;
                           cust.memb_days_left = points[pos2].total_days;
                           cust.memb_amount = 0
                           cust.start_date = new Date().toISOString().slice(0, 10);
                           await cust.save();
                        } else {
                           // means at top
                           console.log("else2",)

                           if (((points[pos2].min_purchase) - (current_role.min_purchase)) == 0) {
                              if ((points[pos2].reduce_purchase) > (cust.memb_amount + paid_price)) {
                                 cust.memb_reduce_amount = ((points[pos2].reduce_purchase) - (cust.memb_amount + paid_price));
                              } else {
                                 cust.memb_reduce_amount = 0;
                              }
                              cust.memb_upg_amount = points[pos2].upg_purchase;
                              cust.customer_type = points[pos2].customer_type;
                              cust.memb_upg_categ = null;
                              cust.memb_days_left = (memb_day_limit - days_diff);
                              cust.memb_amount = (cust.memb_amount + paid_price)
                              await cust.save();
                           } else {
                              cust.memb_upg_amount = points[pos2].upg_purchase;
                              cust.memb_reduce_amount = points[pos2].reduce_purchase;
                              cust.customer_type = points[pos2].customer_type;
                              cust.memb_upg_categ = null;
                              cust.memb_days_left = points[pos2].total_days;
                              cust.memb_amount = 0
                              cust.start_date = new Date().toISOString().slice(0, 10);
                              await cust.save();
                           }
                        }
                     } else {
                        if ((cust.memb_amount + paid_price) >= current_role.reduce_purchase) {
                           cust.memb_upg_amount = current_role.upg_purchase - (cust.memb_amount + paid_price);
                           cust.memb_reduce_amount = 0;
                           cust.memb_days_left = (memb_day_limit - days_diff);
                           cust.memb_amount = (cust.memb_amount + paid_price)
                           await cust.save();
                        } else {
                           cust.memb_upg_amount = current_role.upg_purchase - (cust.memb_amount + paid_price);
                           cust.memb_reduce_amount = (current_role.reduce_purchase - (cust.memb_amount + paid_price));
                           cust.memb_days_left = (memb_day_limit - days_diff);
                           cust.memb_amount = (cust.memb_amount + paid_price)
                           await cust.save();
                        }
                     }
                  }
               } else {
                  if (points.length == 0) {
                     console.log("new")
                     if ((current_role.reduce_purchase) > (paid_price)) {
                        if (((new_array[new_array.length - 2].reduce_purchase) > (paid_price))) {
                           cust.memb_reduce_amount = ((new_array[new_array.length - 2].reduce_purchase) - (paid_price));
                        } else {
                           cust.memb_reduce_amount = 0;
                        }

                        cust.memb_days_left = (new_array[new_array.length - 2].total_days);
                        cust.start_date = new Date().toISOString().slice(0, 10);
                        cust.memb_amount = (paid_price)
                        cust.memb_upg_amount = new_array[new_array.length - 2].upg_purchase;
                        cust.customer_type = new_array[new_array.length - 2].customer_type;
                        cust.memb_upg_categ = current_role.customer_type;
                        await cust.save();
                     } else {
                        cust.memb_reduce_amount = current_role.reduce_purchase;
                        cust.memb_amount = 0;
                        cust.start_date = new Date().toISOString().slice(0, 10);
                        cust.memb_days_left = (memb_day_limit);
                        cust.memb_upg_amount = current_role.upg_purchase;
                        cust.customer_type = current_role.customer_type;
                        cust.memb_upg_categ = null;
                        await cust.save();
                     }
                  } else {
                     if (pos == 0) {
                        var pos2 = points.findIndex(i => ((i.min_purchase - current_role.min_purchase) <= (paid_price)));
                        if (pos2 > -1) {
                           if (points[pos2 - 1]) {
                              console.log("points[pos2 - 1]", points[pos2 + 1])
                              cust.memb_upg_amount = points[pos2].upg_purchase;
                              cust.memb_reduce_amount = points[pos2].reduce_purchase;
                              cust.customer_type = points[pos2].customer_type;
                              cust.memb_upg_categ = points[pos2 - 1].customer_type;
                              cust.memb_days_left = points[pos2].total_days;
                              cust.memb_amount = 0
                              cust.start_date = new Date().toISOString().slice(0, 10);
                              await cust.save();
                           } else {
                              cust.memb_upg_amount = points[pos2].upg_purchase;
                              cust.memb_reduce_amount = points[pos2].reduce_purchase;
                              cust.customer_type = points[pos2].customer_type;
                              cust.memb_upg_categ = null;
                              cust.memb_days_left = points[pos2].total_days;
                              cust.memb_amount = 0
                              cust.start_date = new Date().toISOString().slice(0, 10);
                              await cust.save();
                           }
                        } else {
                           if ((paid_price) >= current_role.reduce_purchase) {
                              cust.memb_upg_amount = current_role.upg_purchase - (paid_price);
                              cust.memb_reduce_amount = 0;
                              cust.memb_days_left = current_role.total_days;
                              cust.start_date = new Date().toISOString().slice(0, 10);
                              cust.memb_amount = (paid_price)
                              await cust.save();
                           } else {
                              cust.memb_upg_amount = current_role.upg_purchase - (paid_price);
                              cust.memb_reduce_amount = (current_role.reduce_purchase - (paid_price));
                              cust.memb_days_left = current_role.total_days;
                              cust.start_date = new Date().toISOString().slice(0, 10);
                              cust.memb_amount = (paid_price)
                              await cust.save();
                           }
                        }
                     } else {
                        var pos2 = points.findIndex(i => ((i.min_purchase - current_role.min_purchase) <= (paid_price)));
                        if (pos2 > -1) {
                           if (points[pos2 - 1]) {
                              cust.memb_upg_amount = points[pos2].upg_purchase;
                              cust.memb_reduce_amount = points[pos2].reduce_purchase;
                              cust.customer_type = points[pos2].customer_type;
                              cust.memb_upg_categ = points[pos2 - 1].customer_type;
                              cust.memb_days_left = points[pos2].total_days;
                              cust.memb_amount = 0
                              cust.start_date = new Date().toISOString().slice(0, 10);
                              await cust.save();
                           } else {
                              cust.memb_upg_amount = points[pos2].upg_purchase;
                              cust.memb_reduce_amount = points[pos2].reduce_purchase;
                              cust.customer_type = points[pos2].customer_type;
                              cust.memb_upg_categ = null;
                              cust.memb_days_left = points[pos2].total_days;
                              cust.memb_amount = 0
                              cust.start_date = new Date().toISOString().slice(0, 10);
                              await cust.save();
                           }
                        } else {
                           if ((paid_price) >= new_array[pos - 1].reduce_purchase) {
                              cust.memb_upg_amount = new_array[pos - 1].upg_purchase;
                              cust.memb_reduce_amount = 0;
                              cust.customer_type = new_array[pos - 1].customer_type;
                              cust.memb_upg_categ = new_array[pos].customer_type;
                              cust.memb_days_left = new_array[pos - 1].total_days;
                              cust.memb_amount = paid_price
                              cust.start_date = new Date().toISOString().slice(0, 10);
                              await cust.save();
                           } else {
                              cust.memb_upg_amount = new_array[pos - 1].upg_purchase;
                              cust.memb_reduce_amount = ((new_array[pos - 1].reduce_purchase) - (paid_price));
                              cust.customer_type = new_array[pos - 1].customer_type;
                              cust.memb_upg_categ = new_array[pos].customer_type;
                              cust.memb_days_left = new_array[pos - 1].total_days;
                              cust.memb_amount = paid_price
                              cust.start_date = new Date().toISOString().slice(0, 10);
                              await cust.save();
                           }
                        }
                     }
                  }
               }
            }
         }
         let order_items_array = req.body.order_items;
         const total_items = order_items_array.length;
         const update = await orders.update({
            customer_no,
            employee_id,
            branch_id,
            branch_name,
            total_items,
            paid_price,
            sub_total,
            tax,
            discount,
            applied_coupons,
            comment,
            status,
            paid,
            payment_method,
            payment_id,
            account_id,
            received,
            change,
            order_type,
            address,
            cash_amount,
            card_amount,
            sgst,
            cgst,
            membership_discount,
            bypass_otp,
            delivery_charges
         }, { where: { order_id } });
         const dest_or_it = await order_items.destroy({
            where: { order_id }
         })
         console.log(dest_or_it)
         // Add all items in orderItems Table with current order ID
         for (var i = 0; i < total_items; i++) {
            const products_data = await product.findOne({
               where: {
                  product_id: order_items_array[i].product_id
               },
               // raw:true
            })
            if (products_data) {
               var quantity = parseInt(order_items_array[i].quantity)
               var items = parseInt(order_items_array[i].quantity)
               quantity = (parseInt(products_data.no_of_order) + quantity)
               items = (parseInt(products_data.items_available) - items)
               if (items < 0) {
                  items = 0;
               }
               console.log("products_data", products_data.no_of_order)
               console.log(order_items_array[i].quantity)
               console.log(items)
               products_data.no_of_order = quantity;
               products_data.items_available = items;
               await products_data.save();
            }
            const new_item = await order_items.create({
               order_id: order_id,
               branch_id: branch_id,
               product_id: order_items_array[i].product_id,
               product_name: order_items_array[i].product_name,
               quantity: order_items_array[i].quantity,
               price: order_items_array[i].price,
               add_ons: order_items_array[i].add_ons,
               discount: order_items_array[i].discount,
               product_type: order_items_array[i].product_type,
               prepare_time: order_items_array[i].prepare_time,
               food_type: order_items_array[i].food_type,
               order_sku: order_items_array[i].order_sku,
               comment: order_items_array[i].comment,
               add_ons_price: order_items_array[i].add_ons_price,
               total_price: order_items_array[i].total_price,
            });
         }
         const update_history = await order_history.update(req.body, { where: { order_id } });
         const newOrder = await orders.findOne({
            where: { order_id },
            include: {
               model: order_items
            }
         });
         if (update[0] && update_history[0]) {
            res.json({
               status: "success",
               msg: "status updated",
               data: newOrder
            });
         }
         else {
            res.json({
               status: "failure",
               msg: "update failed"
            });
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: err
         });
      }
   }


   async update_order(req, res) {
      try {
         const order_id = req.body.order_id;
         const update = await orders.update(req.body, { where: { order_id } });
         const update_history = await order_history.update(req.body, { where: { order_id } });
         const newOrder = await orders.findOne({
            where: { order_id },
            include: {
               model: order_items
            }
         });
         if (update[0] && update_history[0]) {
            res.json({
               status: "success",
               msg: "status updated",
               data: newOrder
            });
         }
         else {
            res.json({
               status: "failure",
               msg: "update failed"
            });
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: err
         });
      }
   }

   async update_order_items(req, res) {
      try {
         const order_items_id = req.body.order_items_id;
         const update = await order_items.update(req.body, { where: { order_items_id } });
         const update_history = await order_items_history.update(req.body, { where: { order_items_id } });
         if (update[0] && update_history[0]) {
            res.json({
               status: "success",
               msg: "status updated"
            });
         }
         else {
            res.json({
               status: "failure",
               msg: "update failed"
            });
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: err
         });
      }
   }

   // addcustwalletmoney
   async addcustwalletmoney(req, res) {
      try {
         const data = await wallet_transaction.create(req.body);
         const cust = await customer.findOne({
            where: {
               mobile_no: req.body.customer_no
            }
         })
         if (cust) {
            var total = cust.wallet_balance + parseInt(req.body.amount);
            // console.log("total",total)
            // console.log("cust.wallet_balance",cust.wallet_balance)
            cust.wallet_balance = total;
            const value = await cust.save();
            // console.log("value", value)
            res.json({
               status: "success",
               total_balance: total,
               msg: "Money Added and Updated!"
            });
         } else {
            res.json({
               status: "success",
               msg: "Money Added But Not Updated!"
            });
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: err
         });
      }
   }


   async fetch_all_orders(req, res) {
      try {
         var pgnum = req.params.number;
         var per_page = 10;
         if (!pgnum) {
            pgnum = 0;
         } else if (pgnum > 0) {
            pgnum = (pgnum - 1) * per_page;
         } else {
            pgnum = 0;
         }
         const employee_id = req.query.employee;
         const branch_id = req.query.branch;
         if (!employee_id) {
            return res.json({
               status: "failure",
               msg: "employee id is required"
            });
         }
         const data = await orders.findAll({
            offset: pgnum, limit: per_page,
            order: [
               ["createdAt", "desc"],
            ],
            include: {
               model: order_items
            },
            where: {
               employee_id: employee_id,
               branch_id: branch_id,
               [Op.not]: [
                  { status: "Hold" },
               ]
            }
         });
         const total_orders = await orders.count({
            where: {
               employee_id,
               branch_id,
               [Op.not]: [
                  { status: "Hold" },
               ]
            }
         });
         if (data.length != 0) {
            res.json({
               status: "success",
               data: data,
               total_orders: total_orders
            });
         }
         else {
            res.json({
               status: "failure",
               msg: "no data found"
            });
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: "no data found"
         });
      }
   }

   async get_preparing_orders(req, res) {
      try {
         var pgnum = req.params.number;
         var per_page = 10;
         if (!pgnum) {
            pgnum = 0;
         } else if (pgnum > 0) {
            pgnum = (pgnum - 1) * per_page;
         } else {
            pgnum = 0;
         }
         const employee_id = req.query.employee;
         if (!employee_id) {
            return res.json({
               status: "failure",
               msg: "employee id is required"
            });
         }
         const data = await orders.findAll({
            offset: pgnum, limit: per_page,
            order: [
               ["createdAt", "desc"],
            ],
            where: {
               [Op.and]: [
                  { employee_id: employee_id },
                  { status: "Preparing" }
               ]
            }
         });
         const total_orders = await orders.count({
            where: {
               [Op.and]: [
                  { employee_id: employee_id },
                  { status: "Preparing" }
               ]
            }
         });
         if (data.length != 0) {
            res.json({
               status: "success",
               data: data,
               total_orders: total_orders
            });
         }
         else {
            res.json({
               status: "failure",
               msg: "no data found"
            });
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: "no data found"
         });
      }
   }

   async get_completed_orders(req, res) {
      try {
         var pgnum = req.params.number;
         var per_page = 10;
         if (!pgnum) {
            pgnum = 0;
         } else if (pgnum > 0) {
            pgnum = (pgnum - 1) * per_page;
         } else {
            pgnum = 0;
         }
         const employee_id = req.query.employee;
         if (!employee_id) {
            return res.json({
               status: "failure",
               msg: "employee id is required"
            });
         }
         const data = await orders.findAll({
            offset: pgnum, limit: per_page,
            order: [
               ["createdAt", "desc"],
            ],
            where: {
               [Op.and]: [
                  { employee_id: employee_id },
                  { status: "Completed" }
               ]
            }
         });
         const total_orders = await orders.count({
            where: {
               [Op.and]: [
                  { employee_id: employee_id },
                  { status: "Completed" }
               ]
            }
         });
         if (data.length != 0) {
            res.json({
               status: "success",
               data: data,
               total_orders: total_orders
            });
         }
         else {
            res.json({
               status: "failure",
               msg: "no data found"
            });
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: "no data found"
         });
      }
   }

   async get_cancelled_orders(req, res) {
      try {
         var pgnum = req.params.number;
         var per_page = 10;
         if (!pgnum) {
            pgnum = 0;
         } else if (pgnum > 0) {
            pgnum = (pgnum - 1) * per_page;
         } else {
            pgnum = 0;
         }
         const employee_id = req.query.employee;
         if (!employee_id) {
            return res.json({
               status: "failure",
               msg: "employee id is required"
            });
         }
         const data = await orders.findAll({
            offset: pgnum, limit: per_page,
            order: [
               ["createdAt", "desc"],
            ],
            where: {
               [Op.and]: [
                  { employee_id: employee_id },
                  { status: "Cancelled" }
               ]
            }
         });
         const total_orders = await orders.count({
            where: {
               [Op.and]: [
                  { employee_id: employee_id },
                  { status: "Cancelled" }
               ]
            }
         });
         if (data.length != 0) {
            res.json({
               status: "success",
               data: data,
               total_orders: total_orders
            });
         }
         else {
            res.json({
               status: "failure",
               msg: "no data found"
            });
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: "no data found"
         });
      }
   }

   async get_hold_orders(req, res) {
      try {
         var pgnum = req.params.number;
         var per_page = 10;
         if (!pgnum) {
            pgnum = 0;
         } else if (pgnum > 0) {
            pgnum = (pgnum - 1) * per_page;
         } else {
            pgnum = 0;
         }
         const employee_id = req.query.employee;
         if (!employee_id) {
            return res.json({
               status: "failure",
               msg: "employee id is required"
            });
         }
         const data = await orders.findAll({
            offset: pgnum, limit: per_page,
            order: [
               ["createdAt", "desc"],
            ],
            where: {
               [Op.and]: [
                  { employee_id: employee_id },
                  { status: "Hold" }
               ]
            }
         });
         const total_orders = await orders.count({
            where: {
               [Op.and]: [
                  { employee_id: employee_id },
                  { status: "Hold" }
               ]
            }
         });
         if (data.length != 0) {
            res.json({
               status: "success",
               data: data,
               total_orders: total_orders
            });
         }
         else {
            res.json({
               status: "failure",
               msg: "no data found"
            });
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: "no data found"
         });
      }
   }


   async get_emp_preparing_orders(req, res) {
      try {
         var pgnum = req.params.number;
         var per_page = 10;
         if (!pgnum) {
            pgnum = 0;
         } else if (pgnum > 0) {
            pgnum = (pgnum - 1) * per_page;
         } else {
            pgnum = 0;
         }
         const employee_id = req.query.employee;
         const branch_id = req.query.branch;
         if (!employee_id) {
            return res.json({
               status: "failure",
               msg: "employee id is required"
            });
         }
         const data = await orders.findAll({
            offset: pgnum, limit: per_page,
            order: [
               ["createdAt", "desc"],
            ],
            where: {
               [Op.and]: [
                  { employee_id: employee_id },
                  { status: "Preparing" },
                  { branch_id: branch_id }
               ]
            }
         });
         const total_orders = await orders.count({
            where: {
               [Op.and]: [
                  { employee_id: employee_id },
                  { status: "Preparing" },
                  { branch_id: branch_id }
               ]
            }
         });
         if (data.length != 0) {
            res.json({
               status: "success",
               data: data,
               total_orders: total_orders
            });
         }
         else {
            res.json({
               status: "failure",
               msg: "no data found"
            });
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: "no data found"
         });
      }
   }

   async get_emp_completed_orders(req, res) {
      try {
         var pgnum = req.params.number;
         var per_page = 10;
         if (!pgnum) {
            pgnum = 0;
         } else if (pgnum > 0) {
            pgnum = (pgnum - 1) * per_page;
         } else {
            pgnum = 0;
         }
         const employee_id = req.query.employee;
         const branch_id = req.query.branch;
         if (!employee_id) {
            return res.json({
               status: "failure",
               msg: "employee id is required"
            });
         }
         const data = await orders.findAll({
            offset: pgnum, limit: per_page,
            order: [
               ["createdAt", "desc"],
            ],
            where: {
               [Op.and]: [
                  { employee_id: employee_id },
                  { status: "Completed" },
                  { branch_id: branch_id }
               ]
            }
         });
         const total_orders = await orders.count({
            where: {
               [Op.and]: [
                  { employee_id: employee_id },
                  { branch_id: branch_id },
                  { status: "Completed" }
               ]
            }
         });
         if (data.length != 0) {
            res.json({
               status: "success",
               data: data,
               total_orders: total_orders
            });
         }
         else {
            res.json({
               status: "failure",
               msg: "no data found"
            });
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: "no data found"
         });
      }
   }

   async get_emp_cancelled_orders(req, res) {
      try {
         var pgnum = req.params.number;
         var per_page = 10;
         if (!pgnum) {
            pgnum = 0;
         } else if (pgnum > 0) {
            pgnum = (pgnum - 1) * per_page;
         } else {
            pgnum = 0;
         }
         const employee_id = req.query.employee;
         const branch_id = req.query.branch;
         if (!employee_id) {
            return res.json({
               status: "failure",
               msg: "employee id is required"
            });
         }
         const data = await orders.findAll({
            offset: pgnum, limit: per_page,
            order: [
               ["createdAt", "desc"],
            ],
            where: {
               [Op.and]: [
                  { employee_id: employee_id },
                  { status: "Cancelled" },
                  { branch_id: branch_id }
               ]
            }
         });
         const total_orders = await orders.count({
            where: {
               [Op.and]: [
                  { employee_id: employee_id },
                  { branch_id: branch_id },
                  { status: "Cancelled" }
               ]
            }
         });
         if (data.length != 0) {
            res.json({
               status: "success",
               data: data,
               total_orders: total_orders
            });
         }
         else {
            res.json({
               status: "failure",
               msg: "no data found"
            });
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: "no data found"
         });
      }
   }

   async get_emp_hold_orders(req, res) {
      try {
         var pgnum = req.params.number;
         var per_page = 10;
         if (!pgnum) {
            pgnum = 0;
         } else if (pgnum > 0) {
            pgnum = (pgnum - 1) * per_page;
         } else {
            pgnum = 0;
         }
         const employee_id = req.query.employee;
         const branch_id = req.query.branch;
         if (!employee_id) {
            return res.json({
               status: "failure",
               msg: "employee id is required"
            });
         }
         const data = await orders.findAll({
            offset: pgnum, limit: per_page,
            order: [
               ["createdAt", "desc"],
            ],
            where: {
               [Op.and]: [
                  { employee_id: employee_id },
                  { status: "Hold" },
                  { branch_id: branch_id }
               ]
            }
         });
         const total_orders = await orders.count({
            where: {
               [Op.and]: [
                  { employee_id: employee_id },
                  { branch_id: branch_id },
                  { status: "Hold" }
               ]
            }
         });
         if (data.length != 0) {
            res.json({
               status: "success",
               data: data,
               total_orders: total_orders
            });
         }
         else {
            res.json({
               status: "failure",
               msg: "no data found"
            });
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: "no data found"
         });
      }
   }

   async get_emp_preparing_orders_logout_time(req, res) {
      try {
         var pgnum = req.params.number;
         var per_page = 10;
         if (!pgnum) {
            pgnum = 0;
         } else if (pgnum > 0) {
            pgnum = (pgnum - 1) * per_page;
         } else {
            pgnum = 0;
         }
         const employee_id = req.query.employee;
         const branch_id = req.query.branch;
         const emp = await employee.findOne({ where: { employee_id } });
         const login_in_time = emp.last_logged_in;
         const logout_time = new Date();
         const data = await orders.findAll({
            offset: pgnum, limit: per_page,
            include: {
               model: order_items
            },
            where: {
               employee_id,
               branch_id,
               status: "Preparing",
               createdAt: {
                  [Op.between]: [login_in_time, logout_time]
               }
            }
         });
         var total_preparing_orders = await orders.count({
            where: {
               employee_id,
               branch_id,
               status: "Preparing",
               createdAt: {
                  [Op.between]: [login_in_time, logout_time]
               }
            }
         });

         if (data.length != 0) {
            res.json({
               status: "success",
               data: data,
               total_preparing_orders: total_preparing_orders
            });
         }
         else {
            res.json({
               status: "failure",
               msg: "no data found"
            });
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: "no data found"
         });
      }
   }

   async get_emp_completed_orders_logout_time(req, res) {
      try {
         var pgnum = req.params.number;
         var per_page = 10;
         if (!pgnum) {
            pgnum = 0;
         } else if (pgnum > 0) {
            pgnum = (pgnum - 1) * per_page;
         } else {
            pgnum = 0;
         }
         const employee_id = req.query.employee;
         const branch_id = req.query.branch;
         const emp = await employee.findOne({ where: { employee_id } });
         const login_in_time = emp.last_logged_in;
         const logout_time = new Date();
         const data = await orders.findAll({
            offset: pgnum, limit: per_page,
            include: {
               model: order_items
            },
            where: {
               employee_id,
               branch_id,
               status: "Completed",
               createdAt: {
                  [Op.between]: [login_in_time, logout_time]
               }
            }
         });
         var total_completed_orders = await orders.count({
            where: {
               employee_id,
               branch_id,
               status: "Completed",
               createdAt: {
                  [Op.between]: [login_in_time, logout_time]
               }
            }
         });
         if (data.length != 0) {
            res.json({
               status: "success",
               data: data,
               total_completed_orders: total_completed_orders
            });
         }
         else {
            res.json({
               status: "failure",
               msg: "no data found"
            });
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: "no data found"
         });
      }
   }

   async get_emp_cancelled_orders_logout_time(req, res) {
      try {
         var pgnum = req.params.number;
         var per_page = 10;
         if (!pgnum) {
            pgnum = 0;
         } else if (pgnum > 0) {
            pgnum = (pgnum - 1) * per_page;
         } else {
            pgnum = 0;
         }
         const employee_id = req.query.employee;
         const branch_id = req.query.branch;
         const emp = await employee.findOne({ where: { employee_id } });
         const login_in_time = emp.last_logged_in;
         const logout_time = new Date();

         const data = await orders.findAll({
            offset: pgnum, limit: per_page,
            include: {
               model: order_items
            },
            where: {
               employee_id,
               branch_id,
               status: "Cancelled",
               createdAt: {
                  [Op.between]: [login_in_time, logout_time]
               }
            }
         });
         var total_cancelled_orders = await orders.count({
            where: {
               employee_id,
               branch_id,
               status: "Cancelled",
               createdAt: {
                  [Op.between]: [login_in_time, logout_time]
               }
            }
         });
         if (data.length != 0) {
            res.json({
               status: "success",
               data: data,
               total_cancelled_orders: total_cancelled_orders
            });
         }
         else {
            res.json({
               status: "failure",
               msg: "no data found"
            });
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: "no data found"
         });
      }
   }

   async get_emp_hold_orders_logout_time(req, res) {
      try {
         var pgnum = req.params.number;
         var per_page = 10;
         if (!pgnum) {
            pgnum = 0;
         } else if (pgnum > 0) {
            pgnum = (pgnum - 1) * per_page;
         } else {
            pgnum = 0;
         }
         const employee_id = req.query.employee;
         const branch_id = req.query.branch;
         const emp = await employee.findOne({ where: { employee_id } });
         const login_in_time = emp.last_logged_in;
         const logout_time = new Date();

         const data = await orders.findAll({
            offset: pgnum, limit: per_page,
            include: {
               model: order_items
            },
            where: {
               employee_id,
               branch_id,
               status: "Hold",
               createdAt: {
                  [Op.between]: [login_in_time, logout_time]
               }
            }
         });
         var total_on_hold_orders = await orders.count({
            where: {
               employee_id,
               branch_id,
               status: "Hold",
               createdAt: {
                  [Op.between]: [login_in_time, logout_time]
               }
            }
         });
         if (data.length != 0) {
            res.json({
               status: "success",
               data: data,
               total_on_hold_orders: total_on_hold_orders
            });
         }
         else {
            res.json({
               status: "failure",
               msg: "no data found"
            });
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: "no data found"
         });
      }
   }


   async fetch_single_order(req, res) {
      try {
         var data = await orders.findOne({
            where: { order_id: req.query.order },
            include: { model: order_items },
            // raw:true
         });
         if (data) {
            var customer_name = "Guest";
            console.log(data)
            if (data.customer_no != null) {
               const customer_exists = await customer.findOne({
                  where: {
                     mobile_no: data.customer_no
                  }
               });
               if (customer_exists) {
                  customer_name = customer_exists.first_name;
                  data.dataValues.customer_name = customer_exists.first_name;
                  res.json({
                     status: "success",
                     data,
                     customer_name
                  });
               } else {
                  customer_name = 'Guest';
                  data.dataValues.customer_name = customer_name;
                  res.json({
                     status: "success",
                     data,
                     customer_name
                  });
               }
            } else {
               customer_name = 'Guest';
               data.dataValues.customer_name = customer_name;
               res.json({
                  status: "success",
                  data,
                  customer_name
               });
            }

         }
         else {
            res.json({
               status: "failure",
               msg: "no data found"
            });
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: "no data found"
         });
      }
   }

   /* -------------------------------- Birthday Section -------------------------- */

   async get_birthday_numbers(req, res) {
      // get all numbers with today birthday
      try {
         var pgnum = req.params.number;
         var per_page = 10;
         if (!pgnum) {
            pgnum = 0;
         } else if (pgnum > 0) {
            pgnum = (pgnum - 1) * per_page;
         } else {
            pgnum = 0;
         }
         const today = new Date();
         const customers = await customer.findAll({
            attributes: ['mobile_no', 'date_of_birth', 'first_name']
         });
         let birthdays = [];
         for (var i = 0; i < customers.length; i++) {
            let dob = new Date(customers[i].date_of_birth);
            if (dob.getDate() == today.getDate() && dob.getMonth() == today.getMonth()) {
               birthdays.push({ mobile_no: customers[i].mobile_no, name: customers[i].first_name });
            }
         }
         const data = birthdays.slice(pgnum, pgnum + per_page);
         if (data.length != 0) {
            res.json({
               status: "success",
               data: data,
               total_birthdays: birthdays.length
            })
         }
         else {
            res.json({
               status: "failure",
               msg: "no data found"
            });
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: "no data found"
         });
      }
   }

   async check_birthday(req, res) {
      try {
         const data = await customer.findOne({
            where: { mobile_no: req.query.mobile }
         });
         if (data) {
            const today = new Date();
            const dob = new Date(data.date_of_birth);
            if (today.getDate() === dob.getDate() && today.getMonth() === dob.getMonth()) {
               res.json({
                  status: "success",
                  msg: "Happy Birthday"
               });
            }
            else {
               res.json({
                  status: "failure",
                  msg: "Not birthday"
               });
            }
         }
         else {
            res.json({
               status: "failure",
               msg: "no data found"
            });
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: "no data found"
         });
      }
   }

   async fetch_recent_customer_order(req, res) {
      try {
         const customer_no = req.query.mobile;
         const data = await orders.findOne({
            order: [
               ['createdAt', 'DESC']
            ],
            attributes: ["order_id", "customer_no", "paid_price", "sub_total", "discount", "createdAt"],
            where: {
               customer_no: customer_no,
               // status: "Completed"
            },
            include: { model: order_items }
         });
         if (data) {
            res.json({
               status: "success",
               data: data
            });
         }
         else {
            res.json({
               status: "failure",
               msg: "no data found"
            });
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: "no data found"
         });
      }
   }

   // fetch_last_5_customer_order
   async fetch_last_5_customer_order(req, res) {
      try {
         const customer_no = req.query.mobile;
         const data = await orders.findAll({
            limit: 5,
            order: [
               ['createdAt', 'DESC']
            ],
            attributes: ["order_id", "customer_no", "paid_price", "sub_total", "discount", "createdAt"],
            where: {
               customer_no: customer_no,
               // status: "Completed"
            },
            include: { model: order_items }
         });
         if (data) {
            res.json({
               status: "success",
               data: data
            });
         }
         else {
            res.json({
               status: "failure",
               msg: "no data found"
            });
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: "no data found"
         });
      }
   }

   // fetch_popular_items
   async fetch_popular_items(req, res) {
      try {
         var branch_id = req.query.branch_id;
         const data = await product.findAll({
            limit: 5,
            where: {
               branch_id
            },
            attributes: [
               // 'product_list_id',
               'product_id',
               [sequelize.fn('sum', sequelize.col('no_of_order')), 'total_count']
            ],
            group: ['product.product_list_id', "product.product_id"],
            order: sequelize.literal('total_count DESC'),
            include: {
               model: product_list,
               include: {
                  model: per_product_add_ons,
                  separate: true,
                  include: {
                     model: add_ons,
                     include: {
                        model: add_on_option
                     }
                  }
               }
            },
            // raw: true,

         });
         res.json({
            status: "success",
            data: data,
            // product_items
            // data: data_cust
         });
         // if (data.length != 0) {
         //    const product_items = await product_list.findAll({
         //       where: {
         //          product_list_id: {
         //             [Op.in]: data.map((b) => b.product_list_id)
         //          }
         //       },
         //       include: {
         //          model: per_product_add_ons,
         //          separate: true,
         //          include: {
         //             model: add_ons,
         //             include: {
         //                model: add_on_option
         //             }
         //          }
         //       }
         //    })
         //    res.json({
         //       status: "success",
         //       data: data,
         //       // product_items
         //       // data: data_cust
         //    });
         // }
         // else {
         //    res.json({
         //       status: "failure",
         //       msg: "no data found"
         //    });
         // }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: "no data found"
         });
      }
   }



   // fetch_last_10_order_customer
   async fetch_last_10_order_customer(req, res) {
      try {
         const employee_id = req.query.employee_id;
         const data = await orders.findAll({
            limit: 10,
            order: [
               ['createdAt', 'DESC']
            ],
            attributes: ["order_id", "customer_no", "paid_price", "sub_total", "discount", "createdAt"],
            where: {
               customer_no: {
                  [Op.not]: null
               },
               employee_id
               // status: "Completed"
            },
            include: { model: order_items }
         });
         if (data.length != 0) {
            for (var i = 0; i < 10; i++) {
               var data_cust = await customer.findAll({
                  where: {
                     [Op.or]: { mobile_no: data.map((item) => item.customer_no) }
                  }
               });
            }
            res.json({
               status: "success",
               // data: data,
               data: data_cust
            });
         }
         else {
            res.json({
               status: "failure",
               msg: "no data found"
            });
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: "no data found"
         });
      }
   }


   // fetch_order_detail
   async fetch_order_detail(req, res) {
      try {
         const order_id = req.query.order_id;
         const data = await orders.findOne({
            order: [
               ['createdAt', 'DESC']
            ],
            attributes: ["order_id", "customer_no", "paid_price", "sub_total", "discount", "createdAt"],
            where: {
               order_id
               // status: "Completed"
            },
            include: { model: order_items }
         });
         if (data) {
            res.json({
               status: "success",
               data: data
            });
         }
         else {
            res.json({
               status: "failure",
               msg: "no data found"
            });
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: "no data found"
         });
      }
   }

   // fetch valid coupons...
   async valid_coupons(req, res) {
      try {
         const { branch_id, customer_no, employee_id, price, bday } = req.body
         const date = new Date();
         var condition;
         const members = await customer_group_members.findAll({
            where: {
               customer_no
            },
            attributes: [
               [sequelize.fn('DISTINCT', sequelize.col('customer_no')), 'customer_no'],
               'customer_no'
            ],
         });
         console.log("members", members)
         //search by title...plat gold etc..working
         if (bday == true || bday == "true") {
            var condition = {
               [Op.or]: [
                  {

                     [Op.and]: {
                        start: { [Op.lte]: date },
                        [Op.or]: [{
                           end: { [Op.gte]: date },
                        },
                        {
                           end: null,
                        }],
                        [Op.or]: [{
                           min_cart: { [Op.lte]: price },
                        },
                        {
                           min_cart: null
                        }],
                        [Op.or]: [{
                           customer_group_name: {
                              [Op.in]: members.map((b) => b.customer_group_name)
                           }
                        },
                        {
                           customer_group_name: null
                        }],
                        [Op.or]: [{
                           [Op.and]: {
                              employee_id: null,
                              branch_id: null,
                              customer_no: null,
                           },
                        },
                        {
                           [Op.and]: {
                              employee_id,
                              branch_id: null,
                              customer_no: null,
                           },
                        },
                        {
                           [Op.and]: {
                              employee_id: null,
                              branch_id,
                              customer_no: null,
                           },
                        },
                        {
                           [Op.and]: {
                              employee_id: null,
                              branch_id: null,
                              customer_no,
                           },
                        },
                        {
                           [Op.and]: {
                              employee_id,
                              branch_id: null,
                              customer_no,
                           },
                        },
                        {
                           [Op.and]: {
                              employee_id,
                              branch_id: null,
                              customer_no,
                           },
                        },
                        {
                           [Op.and]: {
                              employee_id,
                              branch_id,
                              customer_no: null,
                           },
                        },
                        {
                           [Op.and]: {
                              employee_id: null,
                              branch_id,
                              customer_no,
                           },
                        },
                        {
                           [Op.and]: {
                              employee_id,
                              branch_id,
                              customer_no,
                           },
                        },
                        ]

                     }
                  },
                  {
                     title: "BIRTHDAY"
                  }
               ],
            }
         } else {
            var condition = {
               [Op.or]: [
                  {
                     [Op.and]: {
                        start: { [Op.lte]: date },
                        [Op.or]: [{
                           end: { [Op.gte]: date },
                        },
                        {
                           end: null,
                        }],
                        [Op.or]: [{
                           min_cart: { [Op.lte]: price },
                        },
                        {
                           min_cart: null
                        }],
                        [Op.or]: [{
                           customer_group_name: {
                              [Op.in]: members.map((b) => b.customer_group_name)
                           }
                        },
                        {
                           customer_group_name: null
                        }],
                        [Op.or]: [{
                           [Op.and]: {
                              employee_id: null,
                              branch_id: null,
                              customer_no: null,
                           },
                        },
                        {
                           [Op.and]: {
                              employee_id,
                              branch_id: null,
                              customer_no: null,
                           },
                        },
                        {
                           [Op.and]: {
                              employee_id: null,
                              branch_id,
                              customer_no: null,
                           },
                        },
                        {
                           [Op.and]: {
                              employee_id: null,
                              branch_id: null,
                              customer_no,
                           },
                        },
                        {
                           [Op.and]: {
                              employee_id,
                              branch_id: null,
                              customer_no,
                           },
                        },
                        {
                           [Op.and]: {
                              employee_id,
                              branch_id: null,
                              customer_no,
                           },
                        },
                        {
                           [Op.and]: {
                              employee_id,
                              branch_id,
                              customer_no: null,
                           },
                        },
                        {
                           [Op.and]: {
                              employee_id: null,
                              branch_id,
                              customer_no,
                           },
                        },
                        {
                           [Op.and]: {
                              employee_id,
                              branch_id,
                              customer_no,
                           },
                        },
                        ]

                     }
                  }
               ],
            }
         }
         const all_coupons = await coupons.findAll({
            where: condition
         })
         res.json({ status: "Success", all_coupons })
      } catch (err) {
         console.log(err)
         res.json({ err })

      }
   }

   // add_coupons
   async add_coupons(req, res) {
      try {
         // console.log(req.body);
         const ans = await coupons.create(req.body)

         res.json({ ans })

      } catch (err) {
         console.log(err)
         res.json({ err })

      }
   }
}

module.exports = new webposController();
