const sequelize = require("sequelize");
const Op = sequelize.Op;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { orders, order_items, employee, order_history, order_items_history, customer
} = require("../models");

class serverController {

    async update_order(req, res) {
        try {
            const order_id = req.body.order_id;
            const update = await orders.update(req.body, { where: { order_id }, limit: 1 });
            const update_history = await order_history.update(req.body, { where: { order_id }, limit: 1 });
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


    async update_batch_delivery_status(req, res) {
        try {
            const order_id = req.body.order_id;
            const order_his = await order_history.findOne({ where: { order_id } });
            if (order_his) {
                console.log(order_his)
                const update_history = await order_items_history.update({ delivery_status: req.body.delivery_status }, { where: { order_history_id: order_his.order_history_id } });
                if (update_history[0]) {
                    console.log("success history update", update_history)
                } else {
                    console.log("failure history update", update_history)
                }
            }
            const update = await order_items.update(req.body, { where: { order_id } });
            const update_order = await orders.update(req.body, { where: { order_id }, limit: 1 });
            const update_order_history = await order_history.update(req.body, { where: { order_id }, limit: 1 });
            if (update[0] && update_order[0] && update_order_history[0]) {
                console.log(update)
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



    async server_login(req, res) {
        try {
            let { email, password } = req.body;
            const role = req.headers.role;
            if (!role) {
                return res.json({
                    status: "failure",
                    msg: "Not Authorized to access this resource"
                });
            }
            const emp = await employee.findOne({ where: { email } });
            if (emp) {
                if (emp.employee_role === role) {
                    const is_match = await bcrypt.compare(password, emp.password);
                    if (is_match) {
                        const token = await jwt.sign({ email }, process.env.JWT_SECRET_TOKEN_SIGNATURE);
                        const last_logged_in = new Date();
                        // storing token and updating last_logged in status
                        const update_employee = await employee.update({ token, last_logged_in }, {
                            where: {
                                employee_id: emp.employee_id
                            }
                        });
                        res.status(200).json({
                            status: "success",
                            token: token
                        });
                    }
                    else
                        res.json({
                            status: "failure",
                            msg: "email or password wrong"
                        });
                }
                else {
                    res.json({
                        status: "failure",
                        msg: "Not Authorized to access this resource"
                    });
                }
            }
            else
                res.json({
                    status: "failure",
                    msg: "employee does not exists"
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

    async get_non_delivered_orders(req, res) {
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
            const branch_id = req.query.branch;
            const results = await orders.findAll({
                offset: pgnum, limit: per_page,
                where: {
                    branch_id,
                    status: "Completed",
                    [Op.or]: [{ delivery_status: false }, { delivery_status: null }]
                },
                include: { model: order_items },
                order: [
                    ['createdAt', 'ASC']
                ]
            });
            let dataValues = [];
            for (var i = 0; i < results.length; i++) {
                dataValues.push(results[i].dataValues);
            }
            const cust = await customer.findAll({
                where: {
                    [Op.or]: [
                        { mobile_no: results.map((cd) => cd.customer_no) }
                    ]
                },
                raw: true
            });
            let data = [];
            for (var i = 0; i < dataValues.length; i++) {
                var obj = {};
                obj.order_id = dataValues[i].order_id;
                obj.customer_no = dataValues[i].customer_no;
                let mob = cust.find(o => o.mobile_no == dataValues[i].customer_no);
                if (mob) {
                    // console.log(mob);
                    obj.customer_name = mob.first_name + ' ' + mob.last_name;
                } else {
                    obj.customer_name = "Guest";
                }
                obj.employee_id = dataValues[i].employee_id;
                obj.branch_id = dataValues[i].branch_id;
                obj.branch_name = dataValues[i].branch_name;
                obj.total_items = dataValues[i].total_items;
                obj.paid_price = dataValues[i].paid_price;
                obj.sub_total = dataValues[i].sub_total;
                obj.tax = dataValues[i].tax;
                obj.discount = dataValues[i].discount;
                obj.applied_coupons = dataValues[i].applied_coupons;
                obj.comment = dataValues[i].comment;
                obj.status = dataValues[i].status;
                obj.paid = dataValues[i].paid;
                obj.completed_time = dataValues[i].completed_time;
                obj.payment_method = dataValues[i].payment_method;
                obj.payment_id = dataValues[i].payment_id;
                obj.account_id = dataValues[i].account_id;
                obj.order_sku = dataValues[i].order_sku;
                obj.createdAt = dataValues[i].createdAt;
                obj.updatedAt = dataValues[i].updatedAt;
                obj.order_type = dataValues[i].order_type;
                obj.address = dataValues[i].address;
                obj.msg_status = dataValues[i].msg_status;
                let kitchen = []
                let barista = []
                for (var j = 0; j < dataValues[i].order_items.length; j++) {
                    if (dataValues[i].order_items[j].product_type === "Kitchen") {
                        kitchen.push(dataValues[i].order_items[j]);
                    }
                    else {
                        barista.push(dataValues[i].order_items[j]);
                    }
                }
                obj.kitchen = kitchen
                obj.barista = barista
                data.push(obj);
            }
            const total_orders = await orders.count({
                where: {
                    branch_id,
                    status: "Completed",
                    [Op.or]: [{ delivery_status: false }, { delivery_status: null }]
                },
                order: [
                    ['createdAt', 'ASC']
                ]
            });
            if (data.length != 0) {
                res.json({
                    status: "success",
                    total_orders: total_orders,
                    data: data

                })
            }
            else {
                res.json({
                    status: "failure",
                    msg: "No orders found"
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

    async get_delivered_orders(req, res) {
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
            const branch_id = req.query.branch;
            const results = await orders.findAll({
                offset: pgnum, limit: per_page,
                where: {
                    branch_id,
                    status: "Completed",
                    delivery_status: true,

                },
                include: { model: order_items },
                order: [
                    ['createdAt', 'DESC']
                ]
            });
            let dataValues = [];
            for (var i = 0; i < results.length; i++) {
                dataValues.push(results[i].dataValues);
            }
            const cust = await customer.findAll({
                where: {
                    [Op.or]: [
                        { mobile_no: results.map((cd) => cd.customer_no) }
                    ]
                },
                raw: true
            });
            let data = [];
            for (var i = 0; i < dataValues.length; i++) {
                var obj = {};
                obj.order_id = dataValues[i].order_id;
                obj.customer_no = dataValues[i].customer_no;
                let mob = cust.find(o => o.mobile_no == dataValues[i].customer_no);
                if (mob) {
                    // console.log(mob);
                    obj.customer_name = mob.first_name + ' ' + mob.last_name;
                } else {
                    obj.customer_name = "Guest";
                }
                obj.employee_id = dataValues[i].employee_id;
                obj.branch_id = dataValues[i].branch_id;
                obj.branch_name = dataValues[i].branch_name;
                obj.total_items = dataValues[i].total_items;
                obj.paid_price = dataValues[i].paid_price;
                obj.sub_total = dataValues[i].sub_total;
                obj.tax = dataValues[i].tax;
                obj.discount = dataValues[i].discount;
                obj.applied_coupons = dataValues[i].applied_coupons;
                obj.comment = dataValues[i].comment;
                obj.status = dataValues[i].status;
                obj.paid = dataValues[i].paid;
                obj.completed_time = dataValues[i].completed_time;
                obj.payment_method = dataValues[i].payment_method;
                obj.payment_id = dataValues[i].payment_id;
                obj.account_id = dataValues[i].account_id;
                obj.order_sku = dataValues[i].order_sku;
                obj.createdAt = dataValues[i].createdAt;
                obj.updatedAt = dataValues[i].updatedAt;
                obj.order_type = dataValues[i].order_type;
                obj.address = dataValues[i].address;
                obj.msg_status = dataValues[i].msg_status;
                let kitchen = []
                let barista = []
                for (var j = 0; j < dataValues[i].order_items.length; j++) {
                    if (dataValues[i].order_items[j].product_type === "Kitchen") {
                        kitchen.push(dataValues[i].order_items[j]);
                    }
                    else {
                        barista.push(dataValues[i].order_items[j]);
                    }
                }
                obj.kitchen = kitchen
                obj.barista = barista
                data.push(obj);
            }
            const total_orders = await orders.count({
                where: {
                    branch_id,
                    status: "Completed",
                    delivery_status: true
                },
                order: [
                    ['createdAt', 'DESC']
                ]
            });
            if (data.length != 0) {
                res.json({
                    status: "success",
                    total_orders: total_orders,
                    data: data
                })
            }
            else {
                res.json({
                    status: "failure",
                    msg: "No orders found"
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

    async employee_info(req, res) {
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
}

module.exports = new serverController();