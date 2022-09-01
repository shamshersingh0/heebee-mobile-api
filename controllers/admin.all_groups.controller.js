const sequelize = require("sequelize");
const Op = sequelize.Op;

const { customer_group, customer_group_members, customer
} = require("../models");

class adminCustomerGroupController {
    async fetch_order_list(req, res) {
        try {
            const franchise_id = req.query.franchise_id;
            const order_id = req.query.order_id;
            const branch_id = req.query.branch_id;
            const min_price = parseFloat(req.query.min_price);
            const max_price = parseFloat(req.query.max_price);
            const customer_no = req.query.customer_no;
            const product_name = req.query.product_name;
            const coupon = req.query.coupon;
            const payment_method = req.query.payment_method;
            const order_type = req.query.order_type;
            var start_date;
            var end_date;
            if (start_date) start_date = new Date(start_date);
            if (end_date) end_date = new Date(end_date);


            var pgnum = req.params.number;
            var per_page = 10;
            if (!pgnum) {
                pgnum = 0;
            } else if (pgnum > 0) {
                pgnum = (pgnum - 1) * per_page;
            } else {
                pgnum = 0;
            }

            var condition = {};
            var prod_cond = {};
            if (customer_no) {
                const seperatedQuery = customer_no
                    .split(" ")
                    .map((item) => `%${item}%`);
                condition.customer_no = {
                    [Op.iLike]: {
                        [Op.any]: seperatedQuery
                    }
                }
                console.log(condition.customer_no)
            }
            if (min_price && max_price) {
                condition.paid_price = {
                    [Op.and]: {
                        [Op.gte]: min_price,
                        [Op.lte]: max_price
                    }
                }
            }
            if (product_name) {
                const seperatedQuery = product_name
                    .split(",")
                    .map((item) => `%${item}%`);
                prod_cond.product_name = {
                    [Op.iLike]: {
                        [Op.any]: seperatedQuery
                    }
                }
            }
            if (order_id) {
                const seperatedQuery = order_id
                    .split(",")
                    .map((item) => `%${item}%`);
                condition.order_id = {
                    [Op.iLike]: {
                        [Op.any]: seperatedQuery
                    }
                }
            }
            if (start_date && end_date) {
                condition.createdAt = {
                    [Op.between]: [start_date, end_date]
                }
            }
            if (payment_method) {
                const seperatedQuery = payment_method
                    .split(" ")
                    .map((item) => `%${item}%`);
                condition.payment_method = {
                    [Op.iLike]: {
                        [Op.any]: seperatedQuery
                    }
                }
            }
            if (order_type) {
                const seperatedQuery = order_type
                    .split(" ")
                    .map((item) => `%${item}%`);
                condition.order_type = {
                    [Op.iLike]: {
                        [Op.any]: seperatedQuery
                    }
                }
            }
            var coup = [];
            if (coupon) {
                const seperatedQuery = coupon
                    .split(",")
                    .map((item) => `${item}`);
                seperatedQuery.forEach((single_coup) => {
                    console.log("single_coup", single_coup)
                    var da = {
                        [Op.contains]: {
                            coupon: single_coup
                        }
                    }
                    coup.push(da)
                })
                condition.applied_coupons = {
                    [Op.or]: coup
                }
            }

            // (uuid,uuid)
            if (franchise_id && franchise_id != "All" && branch_id && branch_id != "All") {
                condition.branch_id = branch_id;
            }
            // (uuid,all)
            else if (franchise_id && franchise_id != "All" && (!branch_id || branch_id == "All")) {
                const all_branches = await branch.findAll({
                    where: {
                        franchise_id
                    }
                });
                condition.branch_id = {
                    [Op.in]: all_branches.map((b) => b.branch_id)
                }
            }
            // (all,all)
            else {
                condition = condition;
            }
            console.log("condition", condition)
            console.log("prod_cond", prod_cond)

            if (!product_name) {
                var data = await orders.findAll({
                    t: pgnum, limit: per_page,
                    where: condition,
                    include: {
                        model: order_items,
                        attributes: ['product_name']
                    }
                });
                var total_orders_count = await orders.count({
                    where: condition
                });
            }
            else {
                var data = await orders.findAll({
                    offset: pgnum, limit: per_page,
                    where: condition,
                    include: {
                        model: order_items,
                        where: prod_cond,
                        attributes: ['product_name']
                    }
                });
                var total_orders = await orders.findAll({
                    where: condition,
                    include: {
                        model: order_items,
                        where: prod_cond
                    }
                });
                var total_orders_count = total_orders.length;
            }

            if (data.length != 0) {
                res.json({
                    status: "success",
                    total_orders_count,
                    data
                });
            }
            else {
                res.json({
                    status: "failure",
                    msg: "No Data Found!"
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

    async fetch_customer_list(req, res) {
        try {
            const franchise_id = req.query.franchise_id;
            const branch_id = req.query.branch_id;
            const order_id = req.query.order_id;
            const min_price = parseFloat(req.query.min_price);
            const max_price = parseFloat(req.query.max_price);
            const customer_no = req.query.customer_no;
            const product_name = req.query.product_name;
            var start_date;
            var end_date;
            if (start_date) start_date = new Date(start_date);
            if (end_date) end_date = new Date(end_date);
            const coupon = req.query.coupon;
            const payment_method = req.query.payment_method;
            const order_type = req.query.order_type;

            var pgnum = req.params.number;
            var per_page = 10;
            if (!pgnum) {
                pgnum = 0;
            } else if (pgnum > 0) {
                pgnum = (pgnum - 1) * per_page;
            } else {
                pgnum = 0;
            }

            var condition = {};
            var prod_cond = {};
            if (customer_no) {
                const seperatedQuery = customer_no
                    .split(" ")
                    .map((item) => `%${item}%`);
                condition.customer_no = {
                    [Op.iLike]: {
                        [Op.any]: seperatedQuery
                    }
                }
                console.log(condition.customer_no)
            }
            if (min_price && max_price) {
                condition.paid_price = {
                    [Op.and]: {
                        [Op.gte]: min_price,
                        [Op.lte]: max_price
                    }
                }
            }
            if (order_id) {
                const seperatedQuery = order_id
                    .split(",")
                    .map((item) => `%${item}%`);
                condition.order_id = {
                    [Op.iLike]: {
                        [Op.any]: seperatedQuery
                    }
                }
            }
            if (product_name) {
                const seperatedQuery = product_name
                    .split(",")
                    .map((item) => `%${item}%`);
                prod_cond.product_name = {
                    [Op.iLike]: {
                        [Op.any]: seperatedQuery
                    }
                }
            }
            if (start_date && end_date) {
                condition.createdAt = {
                    [Op.between]: [start_date, end_date]
                }
            }
            if (payment_method) {
                const seperatedQuery = payment_method
                    .split(" ")
                    .map((item) => `%${item}%`);
                condition.payment_method = {
                    [Op.iLike]: {
                        [Op.any]: seperatedQuery
                    }
                }
            }
            if (order_type) {
                const seperatedQuery = order_type
                    .split(" ")
                    .map((item) => `%${item}%`);
                condition.order_type = {
                    [Op.iLike]: {
                        [Op.any]: seperatedQuery
                    }
                }
            }
            var coup = [];
            if (coupon) {
                const seperatedQuery = coupon
                    .split(",")
                    .map((item) => `${item}`);
                seperatedQuery.forEach((single_coup) => {
                    console.log("single_coup", single_coup)
                    var da = {
                        [Op.contains]: {
                            coupon: single_coup
                        }
                    }
                    coup.push(da)
                })
                condition.applied_coupons = {
                    [Op.or]: coup
                }
            }

            // (uuid,uuid)
            if (franchise_id && franchise_id != "All" && branch_id && branch_id != "All") {
                condition.branch_id = branch_id;
            }
            // (uuid,all)
            else if (franchise_id && franchise_id != "All" && (!branch_id || branch_id == "All")) {
                const all_branches = await branch.findAll({
                    where: {
                        franchise_id
                    }
                });
                condition.branch_id = {
                    [Op.in]: all_branches.map((b) => b.branch_id)
                }
            }
            // (all,all)
            else {
                condition = condition;
            }
            if (!product_name) {
                var order_list = await orders.findAll({
                    where: condition
                });
                var data = await customer.findAll({
                    t: pgnum, limit: per_page,
                    where: {
                        mobile_no: {
                            [Op.in]: order_list.map((d) => d.customer_no)
                        }
                    }
                });
                var total_customer_count = await customer.count({
                    where: {
                        mobile_no: {
                            [Op.in]: order_list.map((d) => d.customer_no)
                        }
                    }
                });
            }
            else {
                var order_list = await orders.findAll({
                    where: condition,
                    include: {
                        model: order_items,
                        where: prod_cond
                    },
                    attributes: ['order_id', 'customer_no']
                });

                var data = await customer.findAll({
                    offset: pgnum, limit: per_page,
                    where: {
                        mobile_no: {
                            [Op.in]: order_list.map((d) => d.customer_no)
                        }
                    }
                });
                var total_customer_count = await customer.count({
                    where: {
                        mobile_no: {
                            [Op.in]: order_list.map((d) => d.customer_no)
                        }
                    }
                });
            }

            if (data.length != 0) {
                res.json({
                    status: "success",
                    total_customer_count,
                    data
                });
            }
            else {
                res.json({
                    status: "failure",
                    msg: "No Data Found!"
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

    async fetch_single_order(req, res) {
        try {
            const order_id = req.query.order_id;
            const data = await orders.findOne({
                where: {
                    order_id
                },
                include: {
                    model: order_items,
                    // attributes: ['product_name']
                }
            });
            if (data) {
                res.json({
                    status: "success",
                    data
                });
            }
            else {
                res.json({
                    status: "failure",
                    msg: "No Data Found!"
                });
            }
        }
        catch (err) {
            res.json({
                status: "failure",
                msg: err
            });
        }
    }

    async add_new_group(req, res) {
        try {
            const group_exists = await customer_group.findOne({
                where: {
                    customer_group_name: req.body.customer_group_name
                }
            });
            if (group_exists) {
                return res.json({
                    status: "failure",
                    msg: "Group already exists"
                });
            }
            else {
                let data = await customer_group.create(req.body);
                if (data) {
                    res.json({
                        status: "success",
                        data: data,
                    });
                }
                else {
                    res.json({
                        status: "failure",
                        msg: "Failed to create new group"
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

    async add_customers_to_group(req, res) {
        try {
            const customer_group_name = req.query.customer_group_name;
            const franchise_id = req.query.franchise_id;
            const order_id = req.query.order_id;
            const branch_id = req.query.branch_id;
            const min_price = parseFloat(req.query.min_price);
            const max_price = parseFloat(req.query.max_price);
            const customer_no = req.query.customer_no;
            const product_name = req.query.product_name;
            const coupon = req.query.coupon;
            const payment_method = req.query.payment_method;
            const order_type = req.query.order_type;
            var start_date;
            var end_date;
            if (start_date) start_date = new Date(start_date);
            if (end_date) end_date = new Date(end_date);


            var pgnum = req.params.number;
            var per_page = 10;
            if (!pgnum) {
                pgnum = 0;
            } else if (pgnum > 0) {
                pgnum = (pgnum - 1) * per_page;
            } else {
                pgnum = 0;
            }

            var condition = {};
            var prod_cond = {};
            if (customer_no) {
                const seperatedQuery = customer_no
                    .split(" ")
                    .map((item) => `%${item}%`);
                condition.customer_no = {
                    [Op.iLike]: {
                        [Op.any]: seperatedQuery
                    }
                }
                console.log(condition.customer_no)
            }
            if (min_price && max_price) {
                condition.paid_price = {
                    [Op.and]: {
                        [Op.gte]: min_price,
                        [Op.lte]: max_price
                    }
                }
            }
            if (product_name) {
                const seperatedQuery = product_name
                    .split(",")
                    .map((item) => `%${item}%`);
                prod_cond.product_name = {
                    [Op.iLike]: {
                        [Op.any]: seperatedQuery
                    }
                }
            }
            if (order_id) {
                const seperatedQuery = order_id
                    .split(",")
                    .map((item) => `%${item}%`);
                condition.order_id = {
                    [Op.iLike]: {
                        [Op.any]: seperatedQuery
                    }
                }
            }
            if (start_date && end_date) {
                condition.createdAt = {
                    [Op.between]: [start_date, end_date]
                }
            }
            if (payment_method) {
                const seperatedQuery = payment_method
                    .split(" ")
                    .map((item) => `%${item}%`);
                condition.payment_method = {
                    [Op.iLike]: {
                        [Op.any]: seperatedQuery
                    }
                }
            }
            if (order_type) {
                const seperatedQuery = order_type
                    .split(" ")
                    .map((item) => `%${item}%`);
                condition.order_type = {
                    [Op.iLike]: {
                        [Op.any]: seperatedQuery
                    }
                }
            }
            var coup = [];
            if (coupon) {
                const seperatedQuery = coupon
                    .split(",")
                    .map((item) => `${item}`);
                seperatedQuery.forEach((single_coup) => {
                    console.log("single_coup", single_coup)
                    var da = {
                        [Op.contains]: {
                            coupon: single_coup
                        }
                    }
                    coup.push(da)
                })
                condition.applied_coupons = {
                    [Op.or]: coup
                }
            }


            // (uuid,uuid)
            if (franchise_id && franchise_id != "All" && branch_id && branch_id != "All") {
                condition.branch_id = branch_id;
            }
            // (uuid,all)
            else if (franchise_id && franchise_id != "All" && (!branch_id || branch_id == "All")) {
                const all_branches = await branch.findAll({
                    where: {
                        franchise_id
                    }
                });
                condition.branch_id = {
                    [Op.in]: all_branches.map((b) => b.branch_id)
                }
            }
            // (all,all)
            else {
                condition = condition;
            }
            var all_customers;
            if (!product_name) {
                var order_list = await orders.findAll({
                    where: condition
                });
                all_customers = await customer.findAll({
                    where: {
                        mobile_no: {
                            [Op.in]: order_list.map((d) => d.customer_no)
                        }
                    },
                    raw: true
                });
            }
            else {
                var order_list = await orders.findAll({
                    where: condition,
                    include: {
                        model: order_items,
                        where: prod_cond
                    },
                    attributes: ['order_id', 'customer_no']
                });
                all_customers = await customer.findAll({
                    where: {
                        mobile_no: {
                            [Op.in]: order_list.map((d) => d.customer_no)
                        }
                    },
                    raw: true
                });
            }

            // check if customer group exists
            const group_exists = await customer_group.findOne({
                where: { customer_group_name }
            });

            if (!group_exists) {
                // Creating new Group
                var new_group = await customer_group.create({
                    customer_group_name
                });
                if (!new_group) {
                    return res.json({
                        status: "failure",
                        msg: "Failed to create new group"
                    });
                } else {
                    const obj = []
                    // populating obj array
                    for (let i = 0; i < all_customers.length; i++) {
                        obj.push({
                            customer_group_name: customer_group_name,
                            customer_no: all_customers[i].mobile_no,
                            customer_id: all_customers[i].customer_id,
                        });
                    }
                    var data = await customer_group_members.bulkCreate(obj);
                    if (data) {
                        res.json({
                            status: "success",
                            data: data,
                        });
                    }
                    else {
                        res.json({
                            status: "failure",
                            msg: "Failed to add new Members"
                        });
                    }
                }
            } else {
                // const same_customers = await customer_group_members.findAll({
                //     where: {
                //         customer_group_name,
                //         [Op.or]: [{ customer_no: all_customers.map((b) => b.mobile_no) }]
                //     },
                //     attributes: ['customer_no']
                // });
                // if(same_customers.length != 0){
                const obj = []
                // populating obj array

                for (let i = 0; i < all_customers.length; i++) {
                    obj.push({
                        customer_group_name: customer_group_name,
                        customer_no: all_customers[i].mobile_no,
                        customer_id: all_customers[i].customer_id,
                    });
                }
                var data = await customer_group_members.bulkCreate(obj);
                if (data) {
                    res.json({
                        status: "success",
                        data: data,
                    });
                }
                else {
                    res.json({
                        status: "failure",
                        msg: "Failed to add new Members"
                    });
                }
                // }
                // else{
                //     const obj = []
                //     // populating obj array
                //     for (let i = 0; i < all_customers.length; i++) {
                //         obj.push({
                //             customer_group_name: customer_group_name,
                //             customer_no: all_customers[i].mobile_no,
                //         });
                //     }
                //     var data = await customer_group_members.bulkCreate(obj);
                //     if (data) {
                //         res.json({
                //             status: "success",
                //             data: data,
                //         });
                //     }
                //     else {
                //         res.json({
                //             status: "failure",
                //             msg: "Failed to add new Members"
                //         });
                //     }
                // }
            }
            // [Op.or]: [
            //     { branch_id: all_branches.map((b) => b.branch_id) }
            // ],



        }
        catch (err) {
            console.log(err)
            res.json({
                status: "failure",
                msg: err
            });
        }
    }

    async get_all_customer_group(req, res) {
        try {
            const data = await customer_group.findAll({
                // include: {
                //     model: customer_group_members
                // }
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

    async get_single_customer_group(req, res) {
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
            const data = await customer_group.findOne({
                where: {
                    customer_group_name: req.query.group_name
                }
            });
            const members = await customer_group_members.findAll({
                offset: pgnum, limit: per_page,
                where: {
                    customer_group_name: req.query.group_name
                },
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.col('customer_no')), 'customer_no'],
                    'customer_no'
                ],
                // include: [{
                //     model: customer,
                //     attributes: ['first_name']
                // }]
            });
            var total_customers;
            const total_members = await customer_group_members.count({
                where: {
                    customer_group_name: req.query.group_name
                },
                // include: [{
                //     model: customer,
                attributes: [
                    [sequelize.literal('COUNT(DISTINCT(customer_no))'), 'customer_no']
                ],
                group: ['customer_no']
                // }]
            }).then(function (count) {
                // count is an integer
                console.log(count.length)
                total_customers = count.length
            });
            if (data) {
                res.json({
                    status: "success",
                    data: data,
                    total_customers,
                    members
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

    async delete_customer_group(req, res) {
        try {
            const { customer_group_name } = req.body
            const respo = await customer_group.findOne({
                where: {
                    customer_group_name,
                }
            });
            if (respo) {
                await respo.destroy();
                const data = await customer_group_members.destroy({
                    where: {
                        customer_group_name,
                    }
                });
                console.log(data)
                res.json({
                    status: "success",
                    data: data
                });
            } else {
                res.json({
                    status: "failure",
                    msg: "No data found!"
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

    async delete_all_customer_from_group(req, res) {
        try {
            const { customer_group_name } = req.body
            const respo = await customer_group.findOne({
                where: {
                    customer_group_name,
                }
            });
            if (respo) {
                const data = await customer_group_members.destroy({
                    where: {
                        customer_group_name,
                    }
                });
                console.log(data)
                res.json({
                    status: "success",
                    data: data
                });
            } else {
                res.json({
                    status: "failure",
                    msg: "No data found!"
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

    async delete_customer_from_group(req, res) {
        try {
            const { customer_group_name, customer_no } = req.body
            const respo = await customer_group_members.findOne({
                where: {
                    customer_group_name,
                    customer_no
                }
            });
            if (respo) {
                const data = await customer_group_members.destroy({
                    where: {
                        customer_group_name,
                        customer_no
                    }
                });
                console.log(data)
                res.json({
                    status: "success",
                    data: data
                });
            } else {
                res.json({
                    status: "failure",
                    msg: "No data found!"
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

    async add_single_customer_from_group(req, res) {
        try {
            const { customer_group_name, customer_no } = req.body
            const respo = await customer_group_members.findOne({
                where: {
                    customer_group_name,
                    customer_no
                }
            });
            if (respo) {
                res.json({
                    status: "failure",
                    msg: "Already Added!"
                });
            } else {
                var chek_cust = await customer.findOne({
                    where: {
                        mobile_no: customer_no
                    }
                });
                if (!chek_cust) {
                    res.json({
                        status: "failure",
                        msg: "No Customer Found!"
                    });
                } else {
                    const data = await customer_group_members.create({
                        customer_group_name,
                        customer_no,
                        customer_id: chek_cust.customer_id
                    });
                    console.log(data)
                    res.json({
                        status: "success",
                        data: data
                    });
                }
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: "failure",
                msg: err
            });
        }

    }

    async search_customer(req, res) {
        try {
            if (req.query.search) {
                var search = req.query.search

                const data = await customer.findAll({
                    where: {
                        [Op.or]: [{
                            mobile_no: {
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            first_name: {
                                [Op.like]: `%${search}%`
                            }
                        }
                        ]
                    }
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
                        msg: "No data found!"
                    });
                }
            }
            else {
                res.json({
                    status: "failure",
                    msg: "No data found!"
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

    async update_customer_group(req, res) {
        try {
            const { customer_group_name, new_val } = req.body
            console.log(req.body)
            const test = await customer_group.findOne({
                where: {
                    customer_group_name: new_val
                }
            });
            if(test != 'null' || test.length !=0){
                const data = await customer_group.update({ customer_group_name: new_val }, {
                    where: {
                        customer_group_name
                    }
                });
                const data2 = await customer_group_members.update({ customer_group_name: new_val }, {
                    where: {
                        customer_group_name
                    }
                });
                console.log("data2",data2)
                if (data[0]) {
                    res.json({
                        status: "success",
                        msg: "Customer Updated Successfully!"
                    });
                }
                else {
                    res.json({
                        status: "failure",
                        msg: "Update Failed!"
                    });
                }
            }else{
                console.log("test",test)
                res.json({
                    status: "failure",
                    msg: "Group Already Exist!"
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

    async fetch_single_customer(req, res) {
        try {
            const mobile_no = req.query.mobile_no;
            const data = await customer.findOne({
                where: {
                    mobile_no
                }
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
}


module.exports = new adminCustomerGroupController();