const sequelize = require("sequelize");
const Op = sequelize.Op;
const { employee, customer, orders, order_items, categories, product, product_list,
    franchise, branch, category_list, add_ons, add_on_option, per_product_add_ons, order_history,
    order_items_history, employee_roles, coupons, customer_roles, emp_cashier, customer_group_members, contact_us
} = require("../models");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const req = require("express/lib/request");

class customerController {

    // Register New Customer
    async customer_signup(req, res) {
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
                // For not updating email and mobile number and password
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

    // contact_us
    async contact_us(req, res) {
        try {
            const customer_details = await contact_us.create(req.body);
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
        catch (e) {
            console.log(e);
            res.status(500).json({
                status: "failure",
                msg: e
            });
        }
    }

    // Send OTP
    async send_otp(req, res) {
        try {
            const { mobile_no } = req.body;
            // Generate Random 4 digit OTP
            // let OTP = Math.floor(1000 + Math.random() * 9000);
            var OTP = 1234;
            // Some OTP Service to send otp to customer mobile
            const data = await customer.update({ OTP }, { where: { mobile_no } });
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
        catch (err) {
            console.log(err);
            res.status(500).json({
                status: "failure",
                msg: err
            });
        }
    }

    // Customer Login
    async customer_login(req, res) {
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

    // fetch all orders
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

    // fetch single order
    async fetch_single_order(req, res) {
        try {
            const data = await orders.findOne({
                where: { order_id: req.query.order },
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

    // checkout order update
    async update_order(req, res) {
        try {
            const order_id = req.body.order_id;
            const update = await orders.update(req.body, { where: { order_id } });
            const update_history = await order_history.update(req.body, { where: { order_id } });
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

    // Checkout Order
    async checkout_order(req, res) {
        try {
            var order_id;
            const { customer_no, branch_id, branch_name, paid_price, sub_total, discount,
                applied_coupons, comment, status, paid, tax, payment_method, payment_id, account_id, received, change, order_type, address, pick_date, pick_time, sgst,
                cgst } = req.body;
            // console.log(payment_method, payment_id, account_id)
            let order_items_array = req.body.order_items;
            const total_items = order_items_array.length;
            var ord_rec_time = null;
            if (req.body.ord_rec_time) {
                ord_rec_time = req.body.ord_rec_time;
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
                order_from: "Website",
                pick_date,
                pick_time,
                sgst,
                cgst
            });
            const newHistoryOrder = await order_history.create({
                order_id,
                customer_no,
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
                order_from: "Website",
                pick_date,
                pick_time,
                sgst,
                cgst
            });
            const order_history_id = newHistoryOrder.order_history_id;
            // Add all items in orderItems Table with current order ID
            for (var i = 0; i < total_items; i++) {
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

    // Edit Profile
    async edit_profile(req, res) {
        try {
            const update_customer = await customer.update(req.body, {
                where: { mobile_no: req.body.mobile_no }
            });
            if (update_customer[0]) {
                res.json({
                    status: "success",
                    msg: "Profile Updated Successfully!"
                });
            }
            else {
                res.json({
                    status: "failure",
                    msg: "Profile Not updated!"
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

    // Get Categories
    async get_categories(req, res) {
        const branch_id = req.query.branch;
        try {
            // show categories by branch id...
            const data = await categories.findAll({
                include: category_list,
                where: {
                    branch_id
                },
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                }
            });
            res.json({
                status: "success",
                data: data
            });

        } catch (error) {
            console.log(error);
            res.json({ status: "failure", error })
        }
    }

    // Get Products
    async get_products(req, res) {
        try {
            console.log("start")
            const branch_id = req.query.branch;
            //pagination...
            var pgnum = req.params.number;
            var per_page = 10;
            if (!pgnum) {
                pgnum = 0;
            } else if (pgnum > 0) {
                pgnum = (pgnum - 1) * per_page;
            } else {
                pgnum = 0;
            }
            var condition = {
                branch_id
            };
            var prod_cond = {};
            var add_ons_include = {
                model: per_product_add_ons,
                attributes: { exclude: ["createdAt", "updatedAt"] },
                separate: true,
                include: {
                    model: add_ons,
                    attributes: { exclude: ["createdAt", "updatedAt"] },
                    include: {
                        model: add_on_option,
                        attributes: { exclude: ["createdAt", "updatedAt"] },
                    }
                },
            }
            if (req.query.food_type) {
                const food_type = req.query.food_type;
                prod_cond = {
                    food_type
                }
            }

            // show products by branch id...
            if (req.query.category) {
                const category_id = req.query.category;
                condition = {
                    category_id,
                    items_available: {
                        [Op.gt]: 0
                    }
                }
            }
            if (req.query.search) {
                var search = req.query.search;
                const seperatedQuery = search
                    .split(" ")
                    .map((item) => `%${item}%`);
                prod_cond = {
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
                        }
                    }
                }
            }
            const data = await product.findAll({
                offset: pgnum, limit: per_page,
                where: condition,
                include: {
                    model: product_list,
                    where: prod_cond,
                    include: add_ons_include
                },
                attributes: { exclude: ["createdAt", "updatedAt"] }
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
                    msg: "No Products Available!"
                });
            }

        } catch (error) {
            console.log(error);
            res.json({ status: "failure", error })

        }
    }

    //Customer Info
    async customer_info(req, res) {
        try {
            const token = req.headers.token;
            if (token) {
                const customer_info = await customer.findOne({
                    where: { token: token },
                    include: {
                        model: customer_roles
                    },
                    attributes: {
                        exclude: ['password']
                    }
                });
                if (customer_info) {
                    res.json({
                        status: "success",
                        data: customer_info
                    });
                }
                else {
                    res.json({
                        status: "failure",
                        msg: "Customer Not Found!"
                    });
                }
            }
            else {
                res.json({
                    status: "failure",
                    msg: "Token is required!"
                })
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

    // Get Franchises with Branches
    async get_branches(req, res) {
        try {
            const data = await franchise.findAll({
                include: {
                    model: branch,
                    attributes: ['branch_id', 'branch_name']
                },
                attributes: ['franchise_id', 'franchise_name']
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
                    msg: "No Franchises and Branches Available!"
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

    // Best Seller Api 
    async best_seller(req, res) {
        try {
            const branch_id = req.query.branch_id;
            const data = await order_items.findAll({
                where: {
                    branch_id
                },
                attributes: [
                    'product_id',
                    [sequelize.fn('sum', sequelize.col('quantity')), 'total_count']
                ],
                group: ['product_id', 'quantity'],
                order: sequelize.literal('total_count DESC'),
                raw: true
            });
            if (data.length != 0) {
                const fina_data = data.slice(0, 6);
                console.log(fina_data.map((b) => b.product_id))
                var arr = fina_data.map((b) => b.product_id)
                const ord = [sequelize.literal(`arr, "product_id")`)];

                const product_info = await product.findAll({
                    where: {
                        product_id: {
                            [Op.in]: fina_data.map((b) => b.product_id)
                        }
                    },
                    include: {
                        model: product_list,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    },
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                });
                res.json({
                    status: "success",
                    // data: data,
                    product_info
                });
            }
            else {
                res.json({
                    status: "failure",
                    msg: "No Data Found !"
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

    // Vefify OTP
    async verify_otp(req, res) {
        try {
            const { mobile_no, email, OTP } = req.body;
            var data;
            if (mobile_no) {
                data = await customer.findOne({
                    where: {
                        mobile_no: mobile_no
                    }
                });
            }
            else {
                data = await customer.findOne({
                    where: {
                        email: email
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

    // Change Password
    async change_password(req, res) {
        try {
            var { mobile_no, email, password } = req.body;
            password = await bcrypt.hash(password, 10);
            var data;
            if (mobile_no) {
                data = await customer.update({ password }, { where: { mobile_no } });
            }
            else {
                data = await customer.update({ password }, { where: { email } });
            }

            if (data[0]) {
                res.json({
                    status: "success",
                    msg: "Password Changed Successfully!"
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

    // fetch valid coupons...
    async valid_coupons(req, res) {
        try {
            const { branch_id, customer_no, price, bday } = req.body
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
            if (bday == true) {
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
                                        employee_id: null,
                                        branch_id,
                                        customer_no,
                                    },
                                }
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
                                        employee_id: null,
                                        branch_id,
                                        customer_no,
                                    },
                                }
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

}


module.exports = new customerController();





