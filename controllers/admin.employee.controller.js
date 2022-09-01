const sequelize = require("sequelize");
const Op = sequelize.Op;
const { employee, orders, order_items, branch, employee_roles, employee_logout_details, wallet_transaction, emp_cashier
} = require("../models");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class adminEmployeeController {
    // Add New Employee
    async add_new_employee(req, res) {
        try {
            // const { full_name, mobile_no, profile_pic, email, date_of_birth, branch, branch_id, employee_role, employee_role_id, gender, address, device, from_ip } = req.body;

            // Check if employee exists
            const emp_exists = await employee.findOne({ where: { email: req.body.email } });
            if (emp_exists) {
                return res.json({
                    status: "failure",
                    msg: "Employee already exists!"
                });
            }
            if (!req.body.email || !req.body.mobile_no || !req.body.password || !req.body.employee_role || !req.body.employee_role_id || !req.body.branch_id || !req.body.branch || !req.body.gender) {
                return res.json({
                    status: "failure",
                    msg: "Please send all required variables!"
                });
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
            res.status(500).json({
                status: "failure",
                msg: e
            });
        }
    }

    // get_customer_roles
    async get_employee_roles(req, res) {
        try {
            const emp_roles = await employee_roles.findAll();
            if (emp_roles) {
                return res.json({
                    status: "success",
                    emp_roles
                });
            } else {
                return res.json({
                    status: "failure",
                    // msg: "Employee already exists!"
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
    // Get All Employees
    async get_all_employees(req, res) {
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
            const franchise_id = req.query.franchise;
            const branch_id = req.query.branch;
            // Manager Condition (uuid,uuid)
            if (franchise_id && franchise_id !== "All" && branch_id && branch_id !== "All") {
                //console.log("Hello1");
                if (req.query.search) {
                    var search = req.query.search;
                    const seperatedQuery = search
                        .split(" ")
                        .map((item) => `%${item}%`);
                    console.log(seperatedQuery)
                    const data = await employee.findAll({
                        offset: pgnum, limit: per_page,
                        where: {
                            branch_id,
                            [Op.and]: {
                                [Op.or]: {
                                    //employee_id: {[Op.iLike]: {[Op.any]: seperatedQuery}},
                                    full_name: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    mobile_no: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    email: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    //date_of_birth: {[Op.iLike]: { [Op.any]: seperatedQuery}},
                                    address: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    status: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    branch: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    employee_role: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    //branch_id: {[Op.iLike]: {[Op.any]: seperatedQuery}},
                                    gender: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                },
                            }
                        }
                    });
                    const total_employees = await employee.count({
                        where: {
                            branch_id,
                            [Op.and]: {
                                [Op.or]: {
                                    //employee_id: {[Op.iLike]: {[Op.any]: seperatedQuery}},
                                    full_name: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    mobile_no: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    email: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    //date_of_birth: {[Op.iLike]: { [Op.any]: seperatedQuery}},
                                    address: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    status: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    branch: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    //branch_id: {[Op.iLike]: {[Op.any]: seperatedQuery}},
                                    gender: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                },
                            }
                        }
                    });
                    if (data.length != 0) {
                        res.json({
                            status: "success",
                            data: data,
                            total_employees: total_employees
                        });
                    }
                    else {
                        res.json({
                            status: "failure",
                            msg: "No employees found!"
                        });
                    }
                }
                else {
                    const data = await employee.findAll({
                        offset: pgnum, limit: per_page,
                        where: { branch_id }
                    });
                    const total_employees = await employee.count({
                        where: { branch_id }
                    });
                    if (data.length != 0) {
                        res.json({
                            status: "success",
                            data: data,
                            total_employees: total_employees
                        });
                    }
                    else {
                        res.json({
                            status: "failure",
                            msg: "No employees found!"
                        });
                    }
                }
            }
            // Region Head and Super Admin / Owner Condition (uuid,all)
            else if (franchise_id && franchise_id !== "All" && branch_id == "All") {
                if (req.query.search) {
                    var search = req.query.search;
                    const seperatedQuery = search
                        .split(" ")
                        .map((item) => `%${item}%`);
                    console.log(seperatedQuery)

                    const all_branches = await branch.findAll({
                        where: {
                            franchise_id
                        }
                    });
                    const data = await employee.findAll({
                        offset: pgnum, limit: per_page,
                        where: {
                            [Op.or]: [
                                { branch_id: all_branches.map((b) => b.branch_id) }
                            ],
                            [Op.and]: {
                                [Op.or]: {
                                    //employee_id: {[Op.iLike]: {[Op.any]: seperatedQuery}},
                                    full_name: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    mobile_no: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    email: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    // date_of_birth: {[Op.iLike]: { [Op.any]: seperatedQuery}},
                                    address: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    status: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    branch: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    //branch_id: {[Op.iLike]: {[Op.any]: seperatedQuery}},
                                    gender: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                },
                            }
                        }
                    });
                    const total_employees = await employee.count({
                        where: {
                            [Op.or]: [
                                { branch_id: all_branches.map((b) => b.branch_id) }
                            ],
                            [Op.and]: {
                                [Op.or]: {
                                    //employee_id: {[Op.iLike]: {[Op.any]: seperatedQuery}},
                                    full_name: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    mobile_no: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    email: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    //date_of_birth: {[Op.iLike]: { [Op.any]: seperatedQuery}},
                                    address: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    status: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    branch: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    //branch_id: {[Op.iLike]: {[Op.any]: seperatedQuery}},
                                    gender: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                },
                            }
                        }
                    });
                    if (data.length != 0) {
                        res.json({
                            status: "success",
                            data: data,
                            total_employees: total_employees
                        });
                    }
                    else {
                        res.json({
                            status: "failure",
                            msg: "No employees found!"
                        });
                    }
                }
                else {
                    const all_branches = await branch.findAll({
                        where: {
                            franchise_id
                        }
                    });
                    const data = await employee.findAll({
                        offset: pgnum, limit: per_page,
                        where: {
                            [Op.or]: [
                                { branch_id: all_branches.map((b) => b.branch_id) }
                            ]
                        }
                    });
                    const total_employees = await employee.count({
                        where: {
                            [Op.or]: [
                                { branch_id: all_branches.map((b) => b.branch_id) }
                            ]
                        }
                    });
                    if (data.length != 0) {
                        res.json({
                            status: "success",
                            data: data,
                            total_employees: total_employees
                        });
                    }
                    else {
                        res.json({
                            status: "failure",
                            msg: "No employees found!"
                        });
                    }
                }
            }
            // Owner / Super Admin Condition (all,all)
            else {
                console.log("hello3");
                if (req.query.search) {
                    var search = req.query.search;
                    const seperatedQuery = search
                        .split(" ")
                        .map((item) => `%${item}%`);
                    console.log(seperatedQuery)

                    const data = await employee.findAll({
                        offset: pgnum, limit: per_page,
                        where: {
                            [Op.and]: {
                                [Op.or]: {
                                    //employee_id: {[Op.iLike]: {[Op.any]: seperatedQuery}},
                                    full_name: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    mobile_no: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    email: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    //date_of_birth: {[Op.iLike]: { [Op.any]: seperatedQuery}},
                                    address: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    status: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    branch: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    //branch_id: {[Op.iLike]: {[Op.any]: seperatedQuery}},
                                    gender: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                },
                            }
                        }
                    });
                    const total_employees = await employee.count({
                        where: {
                            [Op.and]: {
                                [Op.or]: {
                                    //employee_id: {[Op.iLike]: {[Op.any]: seperatedQuery}},
                                    full_name: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    mobile_no: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    email: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    //date_of_birth: {[Op.iLike]: { [Op.any]: seperatedQuery}},
                                    address: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    status: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    branch: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    //branch_id: {[Op.iLike]: {[Op.any]: seperatedQuery}},
                                    gender: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                },
                            }
                        }
                    });
                    if (data.length != 0) {
                        res.json({
                            status: "success",
                            data: data,
                            total_employees: total_employees
                        });
                    }
                    else {
                        res.json({
                            status: "failure",
                            msg: "No employees found!"
                        });
                    }
                }
                else {
                    const data = await employee.findAll({
                        offset: pgnum, limit: per_page
                    });
                    const total_employees = await employee.count();
                    if (data.length != 0) {
                        res.json({
                            status: "success",
                            data: data,
                            total_employees: total_employees
                        });
                    }
                    else {
                        res.json({
                            status: "failure",
                            msg: "No employees found!"
                        });
                    }
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

    // fetch_all_branches
    async fetch_all_branches(req, res) {
        try {
            const data = await branch.findAll({
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
                    msg: "No data found!"
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


    // get Employee 
    async get_employee(req, res) {
        try {
            const employee_id = req.query.employee;
            const data = await employee.findOne({ where: { employee_id } });
            var tax = await orders.sum("tax", { where: { employee_id, status: { [Op.not]: "Cancelled" } } });
            var total_orders_taken = await orders.count({ where: { employee_id, status: { [Op.not]: "Cancelled" } } });
            var total_revenue = await orders.sum("paid_price", { where: { employee_id, status: { [Op.not]: "Cancelled" } } });
            if (!total_revenue) total_revenue = 0
            if (!tax) tax = 0
            var recent_orders = await orders.findOne({
                where: { employee_id, status: { [Op.not]: "Cancelled" } },
                order: [
                    ["createdAt", "DESC"]
                ],
                include: {
                    model: order_items
                }
            });
            var recent_order = ""
            if (recent_orders) {
                for (var i = 0; i < recent_orders.order_items.length; i++) {
                    recent_order += recent_orders.order_items[i].product_name + ","
                }
            }
            if (data) {
                res.json({
                    status: "success",
                    data: data,
                    total_revenue: total_revenue.toFixed(2),
                    total_orders_taken: total_orders_taken,
                    recent_order: recent_order,
                    avg_purchase: (total_revenue / total_orders_taken).toFixed(2),
                    tax: tax.toFixed(2),
                });
            }
            else {
                res.json({
                    status: "failure",
                    msg: "No data found!"
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

    // get_employee_login_details
    async get_employee_login_details(req, res) {
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
            const employee_id = req.body.employee_id;
            const branch_id = req.body.branch_id;
            var log_in = req.body.log_in;
            var log_out = req.body.log_out;
            var condition = {};
            if (log_in && log_out) {
                var log_in = new Date(log_in);
                var log_out = new Date(log_out);
                log_out = log_out.setDate(log_out.getDate() + 1);
                log_out = new Date(log_out)
                console.log(log_out)
                condition.log_in = {
                    [Op.gte]: log_in
                }
                condition.log_out = {
                    [Op.lte]: log_out
                }
            }
            if (employee_id) {
                condition.employee_id = employee_id
            }
            if (branch_id) {
                condition.branch_id = branch_id
            }
            const data = await employee_logout_details.findAll({
                offset: pgnum, limit: per_page,
                where: condition,
                order: [
                    ["createdAt", "DESC"]
                ],
            });
            const total_count = await employee_logout_details.count({
                where: condition
            });
            if (data.length != 0) {
                res.json({
                    status: "success",
                    data: data,
                    total_count
                });
            } else {
                res.json({
                    status: "failure",
                    msg: "No data found!"
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

    // get_employee_logout_report
    async get_single_employee_logout_report(req, res) {
        try {
            var emp_cash_data;

            const employee_id = req.body.employee_id;
            const branch_id = req.body.branch_id;
            const emp = await employee.findOne({ where: { employee_id } });
            var login_in_time = req.body.log_in;
            var logout_time = req.body.log_out;
            if ((logout_time == null) || (logout_time == "")) {
                logout_time = new Date();
                logout_time = logout_time.setDate(logout_time.getDate() + 1);
                logout_time = new Date(logout_time)
            }
            console.log("logout_time", logout_time)
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
            // const all_orders = await orders.findAll({
            //     offset: pgnum, limit: per_page,
            //     where: {
            //         employee_id,
            //         branch_id,
            //         createdAt: {
            //             [Op.between]: [login_in_time, logout_time]
            //         }
            //     },
            //     include: {
            //         model: order_items
            //     }
            // })
            // console.log("all_orders", all_orders)
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
                emp_cash_data = await emp_cashier.findOne({
                    where: {
                        employee_id,
                        branch_id,
                        createdAt: {
                            [Op.between]: [login_in_time, logout_time]
                        }
                    },
                    raw: true
                });
                if (emp_cash_data) {
                    var init_cash = emp_cash_data.initial_cash;
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
                        // all_orders: all_orders
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
                        // all_orders: all_orders
                        // preparing_orders:preparing_orders,
                        // on_hold_orders:on_hold_orders,
                        // completed_orders:completed_orders,
                        // cancelled_orders:cancelled_orders
                    });
                }
            }
            else {
                console.log(login_in_time)
                emp_cash_data = await emp_cashier.findOne({
                    where: {
                        employee_id,
                        branch_id,
                        createdAt: {
                            [Op.between]: [login_in_time, logout_time]
                        }
                    },
                    raw: true
                });
                if (emp_cash_data) {
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
                    // const update = await emp_cashier.update({
                    //     total_revenue: (total_revenue + total_money_wallet),
                    //     final_cash: final_cash,
                    //     logout_time: logout_time
                    // }, {
                    //     where: {
                    //         emp_cashier_id
                    //     }
                    // });
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
                        // all_orders: all_orders
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

    // get employee orders
    async get_employee_orders(req, res) {
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
            if (req.query.search) {
                var search = req.query.search;
                const seperatedQuery = search
                    .split(" ")
                    .map((item) => `%${item}%`);
                console.log(seperatedQuery)
                const data = await orders.findAll({
                    offset: pgnum, limit: per_page,
                    include: {
                        model: order_items,
                        attributes: ["product_name"]
                    },
                    where: {
                        employee_id,
                        status: {
                            [Op.not]: "Cancelled"
                        },
                        [Op.and]: {
                            [Op.or]: {
                                //paid_price: {[Op.iLike]: {[Op.any]: seperatedQuery}},
                                payment_method: {
                                    [Op.iLike]: {
                                        [Op.any]: seperatedQuery
                                    }
                                },
                                order_id: {
                                    [Op.iLike]: {
                                        [Op.any]: seperatedQuery
                                    }
                                },
                                branch_name: {
                                    [Op.iLike]: {
                                        [Op.any]: seperatedQuery
                                    }
                                }
                            },
                        }
                    }
                });
                const total_orders = await orders.count({
                    where: {
                        employee_id,
                        status: {
                            [Op.not]: "Cancelled"
                        },
                        [Op.and]: {
                            [Op.or]: {
                                //paid_price: {[Op.iLike]: {[Op.any]: seperatedQuery}},
                                payment_method: {
                                    [Op.iLike]: {
                                        [Op.any]: seperatedQuery
                                    }
                                },
                                order_id: {
                                    [Op.iLike]: {
                                        [Op.any]: seperatedQuery
                                    }
                                },
                                branch_name: {
                                    [Op.iLike]: {
                                        [Op.any]: seperatedQuery
                                    }
                                }
                            },
                        }
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
                        msg: "No data found!"
                    });
                }
            }
            else {
                const data = await orders.findAll({
                    offset: pgnum, limit: per_page,
                    where: {
                        employee_id: employee_id,
                        status: {
                            [Op.not]: "Cancelled"
                        }
                    },
                    include: {
                        model: order_items,
                        attributes: ["product_name"]
                    }
                });
                const total_orders = await orders.count({
                    where: {
                        employee_id: employee_id,
                        status: {
                            [Op.not]: "Cancelled"
                        }
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
                        msg: "No data found!"
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

    // Individual Empoyee Graph
    async employee_sales_analytics(req, res) {
        try {
            const today = new Date();
            const monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const year = parseInt(req.query.year);
            var month = monthArray.indexOf(req.query.month);
            if (month == -1) month = null;
            const employee_id = req.query.employee;
            const filter_by = req.query.filter_by;
            //const emp = await employee.findOne({ where: { employee_id },attributes:["branch_id"] });
            //var branch_id = emp.branch_id;

            // 3 hrs interval
            if (filter_by == "today") {
                const all_orders = await orders.findAll({
                    where: { employee_id, status: { [Op.not]: "Cancelled" } },
                });
                var num_of_sales = 0;
                let X = []
                let Y = []
                for (var i = 0; i < 24; i += 3) {
                    var interval1 = new Date(today.getFullYear(), today.getMonth(), today.getDate(), i);
                    var interval2 = new Date(today.getFullYear(), today.getMonth(), today.getDate(), i + 3);
                    var sales_revenue = 0;
                    for (var j = 0; j < all_orders.length; j++) {
                        const order_time = new Date(all_orders[j].dataValues.createdAt);
                        if (order_time >= interval1 && order_time < interval2) {
                            num_of_sales++;
                            sales_revenue += all_orders[j].dataValues.paid_price;
                        }
                    }
                    X.push(i + 3);
                    Y.push(sales_revenue);
                }
                // const avg_sales_per_day = (num_of_sales / 30).toFixed(2);
                if (all_orders.length != 0) {
                    res.json({
                        status: "success",
                        num_of_sales: num_of_sales,
                        sales_revenue: sales_revenue.toFixed(2),
                        x: X,
                        y: Y
                        //avg_sales_per_day: avg_sales_per_day
                    })
                }
                else {
                    res.json({
                        status: "failure",
                        msg: "no data found"
                    });
                }

            }
            // Last 7 days
            else if (filter_by == "weekly") {
                const all_orders = await orders.findAll({
                    where: { employee_id, status: { [Op.not]: "Cancelled" } },
                });
                var num_of_sales = 0;
                let Y = new Array(7).fill(0)
                let dayArr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
                for (var i = 0; i <= 6; i++) {
                    var interval1 = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (i + 1), 0, 0, 0);
                    var interval2 = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (i + 1), 23, 59, 59);
                    var sales_revenue = 0;
                    for (var j = 0; j < all_orders.length; j++) {
                        const order_time = new Date(all_orders[j].dataValues.createdAt);
                        if (order_time >= interval1 && order_time < interval2) {
                            num_of_sales++;
                            sales_revenue += all_orders[j].dataValues.paid_price;
                        }
                    }
                    Y[interval1.getDay()] = sales_revenue;
                    // console.log(dayArr[interval1.getDay()]);
                }
                // const avg_sales_per_day = (num_of_sales / 30).toFixed(2);
                if (all_orders.length != 0) {
                    res.json({
                        status: "success",
                        num_of_sales: num_of_sales,
                        sales_revenue: sales_revenue,
                        x: dayArr,
                        y: Y
                        //avg_sales_per_day: avg_sales_per_day
                    })
                }
                else {
                    res.json({
                        status: "failure",
                        msg: "no data found"
                    });
                }
            }
            // Yearly
            else if (filter_by == "yearly") {

                // Send all year wise
                if (year == "all" || !year) {
                    let all_years = [];
                    const all_orders = await orders.findAll({
                        where: { employee_id, status: { [Op.not]: "Cancelled" } },
                    });
                    //console.log(all_orders[0].dataValues)
                    for (var i = 0; i < all_orders.length; i++) {
                        const y = new Date(all_orders[i].dataValues.createdAt).getFullYear();
                        // check if year exists in array
                        if (all_years.indexOf(y) == -1) {
                            all_years.push(y);
                        }
                    }
                    //console.log(all_years);
                    let X = [];
                    let Y = [];
                    for (var i = 0; i < all_years.length; i++) {
                        let sales_revenue = 0;
                        for (var j = 0; j < all_orders.length; j++) {
                            const order_year = new Date(all_orders[j].dataValues.createdAt);
                            if (order_year.getFullYear() == all_years[i]) {
                                sales_revenue += all_orders[j].dataValues.paid_price;
                            }
                        }
                        X.push(all_years[i]);
                        Y.push(sales_revenue);
                    }
                    res.json({
                        status: "success",
                        x: X,
                        y: Y
                    });

                }
                // send all months of particular year
                else {
                    const yearStart = new Date(year, 0, 1);
                    const yearEnd = new Date(year, 11, 31);
                    // return All records of particular year
                    const all_orders = await orders.findAll({
                        where: {
                            employee_id,
                            status: { [Op.not]: "Cancelled" },
                            createdAt: {
                                [Op.between]: [yearStart, yearEnd]
                            }
                        }
                    });
                    let Y = []
                    for (var i = 0; i < 12; i++) {
                        let sales_revenue = 0;
                        for (var j = 0; j < all_orders.length; j++) {
                            const order_date = new Date(all_orders[j].dataValues.createdAt);
                            if (order_date.getMonth() == i) {
                                sales_revenue += all_orders[j].dataValues.paid_price;
                            }
                        }
                        Y.push(sales_revenue);
                    }
                    res.json({
                        status: "success",
                        x: monthArray,
                        y: Y
                    });
                }
            }
            // Monthly
            else {
                // Send data in 5 days interval of particular month 
                if (req.query.month && req.query.year && req.query.year != "All") {
                    const monthStart = new Date(year, month, 0);
                    console.log(monthStart)
                    const monthEnd = new Date(year, month, 31);
                    const all_orders = await orders.findAll({
                        where: {
                            employee_id,
                            status: { [Op.not]: "Cancelled" },
                            createdAt: {
                                [Op.between]: [monthStart, monthEnd]
                            }
                        }
                    });
                    console.log(all_orders.length)
                    let X = [];
                    let Y = [];
                    for (var i = 0; i < 31; i += 5) {
                        let sales_revenue = 0;
                        for (var j = 0; j < all_orders.length; j++) {
                            if (all_orders[j].createdAt.getDate() >= i && all_orders[j].createdAt.getDate() < i + 5) {
                                sales_revenue += all_orders[i].paid_price;
                            }
                        }
                        X.push(i);
                        Y.push(sales_revenue.toFixed(2));
                    }
                    res.json({
                        status: "success",
                        x: X,
                        y: Y
                    });
                }
                else {
                    const yearStart = new Date(today.getFullYear(), 0, 1);
                    const yearEnd = new Date(today.getFullYear(), 11, 31);
                    // return All records of particular year
                    const all_orders = await orders.findAll({
                        where: {
                            employee_id,
                            status: { [Op.not]: "Cancelled" },
                            createdAt: {
                                [Op.between]: [yearStart, yearEnd]
                            }
                        }
                    });
                    let Y = []
                    for (var i = 0; i < 12; i++) {
                        let sales_revenue = 0;
                        for (var j = 0; j < all_orders.length; j++) {
                            const order_date = new Date(all_orders[j].dataValues.createdAt);
                            if (order_date.getMonth() == i) {
                                sales_revenue += all_orders[j].dataValues.paid_price;
                            }
                        }
                        Y.push(sales_revenue);
                    }
                    res.json({
                        status: "success",
                        x: monthArray,
                        y: Y
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
    // update_single_customer
    async update_single_employee(req, res) {
        try {
            const emp_exist = await employee.findOne({ where: { employee_id: req.query.employee_id } });
            if (emp_exist) {
                if (req.body.password) {
                    req.body.password = await bcrypt.hash(req.body.password, 10);
                }
                const update_emp = await employee.update(req.body, {
                    where: {
                        employee_id: req.query.employee_id
                    }
                });
                if (update_emp[0]) {
                    res.status(200).json({
                        status: "success",
                    });
                }
            } else {
                res.json({
                    status: "failure",
                    msg: err
                });
            }
        }
        catch (err) {
            console.log(err)
            res.json({
                status: "failure",
                msg: err
            });
        }
    }

    // search_emp
    async search_emp(req, res) {
        try {
            var per_page = 10;
            const search = '%' + req.query.search + '%';
            const data = await employee.findAll({
                 limit: per_page,
                where: {
                    [Op.or]: {
                        full_name: { [Op.iLike]:  search  },
                        mobile_no: { [Op.iLike]:  search  },
                        email: { [Op.iLike]:  search  }
                    }
                }
            });
            if (data.length != 0) {
                res.status(200).json({
                    status: "success",
                    data
                });
            } else {
                res.json({
                    status: "failure"
                });
            }
        }
        catch (err) {
            console.log(err)
            res.json({
                status: "failure",
                msg: err
            });
        }
    }
    // staff_reports
    async staff_reports(req, res) {
        try {
            const employee_id = req.body.employee_id;
            const branch_id = req.body.branch_id;
            const status = req.body.status;
            var start = req.body.start;
            var end = req.body.end;
            var condition = {};
            if ((employee_id) && (employee_id !== "All")) {
                condition.employee_id = employee_id;
            }
            if ((branch_id) && (branch_id !== "All")) {
                condition.branch_id = branch_id;
            }
            if ((status) && (status !== "All")) {
                condition.status = status;
            }
            if (start && end) {
                start = new Date(start);
                end = new Date(end);
                end = end.setDate(end.getDate() + 1);
                end = new Date(end)
                console.log(end)
                condition.createdAt = {
                    [Op.and]: [
                        {
                            [Op.gte]: start
                        },
                        {
                            [Op.lte]: end
                        }
                    ]
                }
            }
            console.log(condition)
            const data = await orders.findAll({
                where: condition,
                attributes: [
                    'employee_id',
                    [sequelize.fn('sum', sequelize.col('paid_price')), 'paid_price'],
                    [sequelize.literal(`COUNT(*)`), 'order_count']
                    // [sequelize.fn('date_format', sequelize.col('createdAt'), '%Y-%m-%d'), 'date_col_formed']
                    // [sequelize.literal(`DATE("createdAt")`), 'date']
                    // [sequelize.fn('COUNT', sequelize.col('order_id')), 'order_id']
                ],
                group: ['orders.employee_id', "emplyees.employee_id"],
                // group: ['employee_id', 'paid_price', 'date'],
                // order: sequelize.literal('total_sales DESC'),
                include: {
                    model: employee,
                    as: "emplyees",
                    attributes: { exclude: ["employee_id"] }
                }
                // order: [
                //     ["paid_price", "DESC"]
                // ]
            });
            var total_revenue = await orders.sum("paid_price", { where: condition });
            var total_order_count = await orders.count({ where: condition });
            if (data.length != 0) {
                res.status(200).json({
                    status: "success",
                    total_sales: total_revenue.toFixed(2),
                    total_order_count,
                    data
                });
            } else {
                res.json({
                    status: "failure"
                });
            }
        }
        catch (err) {
            console.log(err)
            res.json({
                status: "failure",
                msg: err
            });
        }
    }

    // staff_reports
    async staff_reports_by_daily(req, res) {
        try {
            var pgnum = req.params.number;
            // var per_page = 200;
            // if (req.query.show) {
            //     per_page = show;
            // }
            // if (!pgnum) {
            //     pgnum = 0;
            // } else if (pgnum > 0) {
            //     pgnum = (pgnum - 1) * per_page;
            // } else {
            //     pgnum = 0;
            // }
            const employee_id = req.body.employee_id;
            const branch_id = req.body.branch_id;
            const status = req.body.status;
            var start = req.body.start;
            var end = req.body.end;
            var condition = {};
            if ((employee_id) && (employee_id !== "All")) {
                condition.employee_id = employee_id;
            }
            if ((branch_id) && (branch_id !== "All")) {
                condition.branch_id = branch_id;
            }
            if ((status) && (status !== "All")) {
                condition.status = status;
            }
            if (start && end) {
                start = new Date(start);
                end = new Date(end);
                end = end.setDate(end.getDate() + 1);
                end = new Date(end)
                console.log(end)
                condition.createdAt = {
                    [Op.and]: [
                        {
                            [Op.gte]: start
                        },
                        {
                            [Op.lte]: end
                        }
                    ]
                }
            }
            console.log(condition)
            const data = await orders.findAll({
                where: condition,
                attributes: [
                    'employee_id',
                    [sequelize.fn('sum', sequelize.col('paid_price')), 'paid_price'],
                    [sequelize.fn('DATE', sequelize.col('orders.createdAt')), 'date'],
                    [sequelize.literal(`COUNT(*)`), 'order_count'],
                    // [sequelize.fn('date_format', sequelize.col('createdAt'), '%Y-%m-%d'), 'date_col_formed']
                    // [sequelize.literal(`DATE("createdAt")`), 'date']
                    // [sequelize.fn('COUNT', sequelize.col('order_id')), 'order_id']
                ],
                group: ["orders.employee_id", 'emplyees.employee_id', [sequelize.fn('DATE', sequelize.col('orders.createdAt')), 'date'],],
                // group: ['orders.createdAt'],
                // group: ['employee_id', 'paid_price', 'createdAt'],
                // order: sequelize.literal('total_sales DESC'),
                include: {
                    model: employee,
                    as: "emplyees",
                    attributes: { exclude: ["employee_id", "createdAt"] }
                }
                // order: [
                //     ["paid_price", "DESC"]
                // ]
            });
            // var total_revenue = await orders.sum("paid_price", { where: condition });
            if (data.length != 0) {
                res.status(200).json({
                    status: "success",
                    total_count: data.length,
                    data
                });
            } else {
                res.json({
                    status: "failure"
                });
            }
        }
        catch (err) {
            console.log(err)
            res.json({
                status: "failure",
                msg: err
            });
        }
    }

    // staff_reports
    async staff_order_list(req, res) {
        try {
            var pgnum = req.params.number;
            var per_page = 25;
            if (req.query.show) {
                per_page = req.query.show;
            }
            if (!pgnum) {
                pgnum = 0;
            } else if (pgnum > 0) {
                pgnum = (pgnum - 1) * per_page;
            } else {
                pgnum = 0;
            }
            const employee_id = req.body.employee_id;
            const branch_id = req.body.branch_id;
            const status = req.body.status;
            var start = req.body.start;
            var end = req.body.end;
            var condition = {};
            if ((employee_id) && (employee_id !== "All")) {
                condition.employee_id = employee_id;
            }
            if ((branch_id) && (branch_id !== "All")) {
                condition.branch_id = branch_id;
            }
            if ((status) && (status !== "All")) {
                condition.status = status;
            }
            if (start && end) {
                start = new Date(start);
                end = new Date(end);
                end = end.setDate(end.getDate() + 1);
                end = new Date(end)
                console.log(end)
                condition.createdAt = {
                    [Op.and]: [
                        {
                            [Op.gte]: start
                        },
                        {
                            [Op.lte]: end
                        }
                    ]
                }
            }
            console.log(condition)
            const data = await orders.findAll({
                offset: pgnum, limit: per_page,
                where: condition,
                attributes: [
                    'employee_id',
                    'paid_price',
                    'order_id',
                    'createdAt',
                    'status',
                    'branch_name'
                ],
                include: {
                    model: employee,
                    as: "emplyees",
                    attributes: { exclude: ["employee_id", "createdAt"] }
                },
                order: [
                    ["createdAt", "ASC"]
                ]
            });
            // var total_revenue = await orders.sum("paid_price", { where: condition });
            var total_order_count = await orders.count({ where: condition });
            if (data.length != 0) {
                res.status(200).json({
                    status: "success",
                    total_order_count,
                    data
                });
            } else {
                res.json({
                    status: "failure"
                });
            }
        }
        catch (err) {
            console.log(err)
            res.json({
                status: "failure",
                msg: err
            });
        }
    }
}

module.exports = new adminEmployeeController();