const sequelize = require("sequelize");
const Op = sequelize.Op;
const { employee, customer, orders, order_items, categories, product, product_list,
    franchise, branch, category_list, add_ons, add_on_option, per_product_add_ons, order_history,
    order_items_history, employee_roles, coupons, customer_roles, emp_cashier, customer_group_members, contact_us,
    customer_ordered_product
} = require("../models");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const customer_ordered_product = require("../models/customer_ordered_product");

class mobileCustomerController{

    async mobile_customer_signup(req, res) {
        try {
            // Check for required fields
            if (!req.body.mobile_no || !req.body.email || !req.body.password || !req.body.branch || !req.body.branch_id) {
                return res.json({
                    status: "failure",
                    msg: "Send All Required Fields!"
                });
            }

            // Check If customer already exist
            const customer_exists = await customer.findOne({
                where: {
                    [Op.or]: {
                        mobile_no: req.body.mobile_no,
                        // email: req.body.email
                    }
                }
            });
            if (customer_exists) {
                // For not updating email, mobile number and password
                // req.body.email = customer_exists.email;
                // req.body.mobile_no = customer_exists.mobile_no;
                // req.body.password = customer_exists.password;
                // const update_customer = await customer.update(req.body, {
                //     where: {
                //         mobile_no: req.body.mobile_no,
                //         email: req.body.email
                //     }
                // });
                return res.json({
                    status: "failure",
                    msg: "Customer Already Exists !"
                });
            }
            else {
                req.body.password = await bcrypt.hash(req.body.password, 10);
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
                const token = await jwt.sign({ mobile_no: req.body.mobile_no }, process.env.JWT_SECRET_TOKEN_SIGNATURE);
                req.body.token = token;
                const customer_details = await customer.create(req.body);
                if (customer_details) {
                    res.json({
                        status: "success",
                        data: customer_details
                    });
                }
                else {
                    res.json({
                        status: "failure",
                        msg: "Customer not registered!"
                    });
                }
            }
        }
        catch (e) {
            console.log(e);
            res.status(500).json({
                status: "failure",
                msg: e
            });
        }
    }


    async mobile_send_otp(req, res) {
        try {
            const { mobile_no } = req.body;
            var OTP = 1234;
            // Some OTP Service to send otp to customer mobile
            const data = await customer.update({ OTP }, { where: { mobile_no } });
            console.log(data)
            // if (data) {
            if (data[0]) {
                res.json({
                    status: "success",
                    data: OTP
                });
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

    async mobile_customer_login(req, res) {
        try {
            let { mobile_no } = req.body;
            var condit = {};
            const customer_exist = await customer.findOne({ where: { mobile_no } });
            if (customer_exist) {
                if (req.body.password) {
                    var password = req.body.password
                    const is_match = await bcrypt.compare(password, customer_exist.password);
                    if (is_match) {
                        const cust_mobile_no = customer_exist.mobile_no;
                        const token = await jwt.sign({ mobile_no: cust_mobile_no }, process.env.JWT_SECRET_TOKEN_SIGNATURE);
                        const last_logged_in = new Date();
                        // storing token and updating last_logged in status
                        const update_customer = await customer.update({ token, last_logged_in }, {
                            where: {
                                mobile_no: mobile_no
                            }
                        });
                        if (update_customer[0]) {
                            res.status(200).json({
                                status: "success",
                                token: token
                            });
                        }
                        else {
                            res.status(500).json({
                                status: "failure",
                                msg: "Something went wrong!"
                            });
                        }
                    }
                    else {
                        res.json({
                            status: "failure",
                            msg: "Password Wrong!"
                        });
                    }
                } else if (req.body.OTP) {
                    if (req.body.OTP == customer_exist.OTP) {
                        const cust_mobile_no = customer_exist.mobile_no;
                        const token = await jwt.sign({ mobile_no: cust_mobile_no }, process.env.JWT_SECRET_TOKEN_SIGNATURE);
                        const last_logged_in = new Date();
                        // storing token and updating last_logged in status
                        const update_customer = await customer.update({ token, last_logged_in }, {
                            where: {
                                mobile_no: mobile_no
                            }
                        });
                        if (update_customer[0]) {
                            res.status(200).json({
                                status: "success",
                                token: token
                            });
                        }
                        else {
                            res.status(500).json({
                                status: "failure",
                                msg: "Something went wrong!"
                            });
                        }
                    } else {
                        res.json({
                            status: "failure",
                            msg: "Incorrect OTP!"
                        });
                    }
                }
            }
            else {
                res.json({
                    status: "failure",
                    msg: "customer not found!"
                });
            }

        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: "failure",
                msg: err
            });
        }
    }

    async mobile_fetch_all_orders(req, res) {
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
            const customer_no = req.query.customer_no;
            if (!customer_no) {
                return res.json({
                    status: "failure",
                    msg: "customer_no id is required"
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
                    customer_no,
                    [Op.not]: [
                        { status: "Hold" },
                    ]
                }
            });
            const total_orders = await orders.count({
                where: {
                    customer_no,
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


    async mobile_fetch_single_order(req, res) {
        try {
            const dta = req.query.order_id
            const data = await orders.findOne({
                where: { order_id: dta },
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

    

}


module.exports = new mobileCustomerController();