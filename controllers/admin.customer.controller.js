const sequelize = require("sequelize");
const Op = sequelize.Op;
const { customer, orders, order_items, franchise, branch, customer_roles, customer_group } = require("../models");
const { get_employee } = require("./admin.employee.controller");
const bcrypt = require('bcryptjs');
class adminCustomerController {


    // gives the details of customer order history according to their phone numbers
    async customer_order_history(req, res) {
        try {
            console.log("this is called");
            const customer_no = req.query.customer_no;
            var pgnum = req.params.no;
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
                if (customer_no) {
                    const data = await orders.findAll({
                        offset: pgnum, limit: per_page,
                        attributes: ['order_id', 'paid_price', 'payment_method', 'payment_id', 'tax', 'applied_coupons', 'createdAt'],
                        order: [
                            ["createdAt", "DESC"]
                        ],
                        include: {
                            model: order_items,
                            attributes: ["product_name", "quantity"]
                        },
                        where: {
                            customer_no,
                            [Op.and]: {
                                [Op.or]: {
                                    // order_id : {[Op.iLike] : {[Op.any] : seperatedQuery}},
                                    // paid_price : {[Op.iLike] : {[Op.any] : seperatedQuery}},
                                    payment_method: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    payment_id: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    // tax : {[Op.iLike] : {[Op.any] : seperatedQuery}},
                                    // applied_coupons : {[Op.iLike] : {[Op.any] : seperatedQuery}}
                                }
                            },

                        },
                    });
                    const customer_data = await customer.findAll({
                        where: { mobile_no: customer_no },
                        attributes: ['first_name', 'last_name', 'mobile_no', 'email', 'gender', 'createdAt', 'shipping_address']
                    })
                    const total_orders = await orders.count({
                        where: { customer_no }
                    });
                    // console.log(data[0].paid_price);
                    var total_revenue = 0;
                    var total_tax = 0;
                    for (var i = 0; i < data.length; i++) {
                        total_revenue += data[0].paid_price;
                        total_tax += data[0].tax;
                    }
                    const popular_orders = await orders.findAll({
                        where: { customer_no },
                        attributes: ["customer_no"],
                        include: {
                            model: order_items,
                            attributes: ["product_name", "quantity", "price"]
                        }
                    });
                    // console.log(popular_orders);
                    const product_details = [];
                    console.log(popular_orders[0].order_items.length);
                    var product = [];
                    var product_quantity = [];
                    var product_price = [];
                    var counter = 0;
                    for (var i = 0; i < popular_orders.length; i++) {
                        for (var j = 0; j < popular_orders[i].order_items.length; j++) {
                            if (product.indexOf(popular_orders[i].order_items[j].product_name) == -1) {
                                counter++;
                                product.push(popular_orders[i].order_items[j].product_name);
                                product_quantity.push(popular_orders[i].order_items[j].quantity);
                                product_price.push(popular_orders[i].order_items[j].price);
                            }
                            else {
                                var ind = product.indexOf(popular_orders[i].order_items[j].product_name);
                                product_quantity[ind] += popular_orders[i].order_items[j].quantity;
                                product_price[ind] += popular_orders[i].order_items[j].price;

                            }
                        }
                    }

                    for (var i = 0; i < product_price.length; i++) {
                        product_price[i] = parseFloat(product_price[i].toFixed(2));
                    }

                    var count = 5;
                    while (count--) {
                        var max_value = -1;
                        var maxi;
                        for (var i = 0; i < product_quantity.length; i++) {
                            if (max_value < product_quantity[i]) {
                                max_value = product_quantity[i];
                                maxi = i;
                            }
                        }
                        // console.log(maxi);
                        var obj = {
                            name: product[maxi],
                            Total_purchase: product_price[maxi],
                            avg_purchase: (product_price[maxi] / total_orders).toFixed(2)
                        }
                        product_quantity[maxi] = -1;
                        product_details.push(obj);
                    }

                    console.log(data);
                    res.json({
                        status: "success",
                        customer_data: customer_data,
                        orders_data: data,
                        most_recent_orders: data[0],
                        total_orders: total_orders,
                        total_revenue: total_revenue.toFixed(2),
                        tax: total_tax.toFixed(2),
                        popular_purchase: product_details
                    })
                }
            }
            else {
                if (customer_no) {
                    console.log("without search is called");
                    const data = await orders.findAll({
                        offset: pgnum, limit: per_page,
                        where: {
                            customer_no,

                        },
                        attributes: ['order_id', 'paid_price', 'payment_method', 'payment_id', 'tax', 'applied_coupons', 'createdAt'],
                        order: [
                            ["createdAt", "DESC"]
                        ],
                        include: {
                            model: order_items,
                            attributes: ["product_name"]
                        }
                    });
                    if (data.length == 0) {
                        res.json({
                            status: "failure",
                            msg: "No orders Found!"
                        })
                    } else {
                        const customer_data = await customer.findAll({
                            where: { mobile_no: customer_no },
                            attributes: ['first_name', 'last_name', 'mobile_no', 'email', 'gender', 'createdAt', 'shipping_address']
                        })
                        const total_orders = await orders.count({
                            where: { customer_no }
                        });
                        console.log("data", data);
                        var total_revenue = 0;
                        var total_tax = 0;
                        for (var i = 0; i < data.length; i++) {
                            total_revenue += data[0].paid_price;
                            total_tax += data[0].tax;
                        }
                        // finding the popular orders
                        const popular_orders = await orders.findAll({
                            where: { customer_no },
                            attributes: ["customer_no"],
                            include: {
                                model: order_items,
                                attributes: ["product_name", "quantity", "price"]
                            }
                        });
                        console.log("popular_orders", popular_orders);
                        const product_details = [];
                        console.log(popular_orders[0].order_items.length);
                        var product = [];
                        var product_quantity = [];
                        var product_price = [];
                        var counter = 0;
                        for (var i = 0; i < popular_orders.length; i++) {
                            for (var j = 0; j < popular_orders[i].order_items.length; j++) {
                                if (product.indexOf(popular_orders[i].order_items[j].product_name) == -1) {
                                    counter++;
                                    product.push(popular_orders[i].order_items[j].product_name);
                                    product_quantity.push(popular_orders[i].order_items[j].quantity);
                                    product_price.push(popular_orders[i].order_items[j].price);
                                }
                                else {
                                    var ind = product.indexOf(popular_orders[i].order_items[j].product_name);
                                    product_quantity[ind] += popular_orders[i].order_items[j].quantity;
                                    product_price[ind] += popular_orders[i].order_items[j].price;

                                }
                            }
                        }

                        for (var i = 0; i < product_price.length; i++) {
                            product_price[i] = parseFloat(product_price[i].toFixed(2));
                        }

                        var count = 5;
                        while (count--) {
                            var max_value = -1;
                            var maxi;
                            for (var i = 0; i < product_quantity.length; i++) {
                                if (max_value < product_quantity[i]) {
                                    max_value = product_quantity[i];
                                    maxi = i;
                                }
                            }
                            // console.log(maxi);
                            var obj = {
                                name: product[maxi],
                                Total_purchase: product_price[maxi],
                                avg_purchase: (product_price[maxi] / total_orders).toFixed(2)
                            }
                            product_quantity[maxi] = -1;
                            product_details.push(obj);
                        }

                        // console.log(product_details);

                        res.json({
                            status: "success",
                            customer_data: customer_data,
                            orders_data: data,
                            most_recent_orders: data[0],
                            total_orders: total_orders,
                            total_revenue: total_revenue.toFixed(2),
                            tax: total_tax.toFixed(2),
                            popular_purchase: product_details
                        })
                    }
                }
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

    // total number of customers according to the month and year
    async customer_dashboard(req, res) {
        try {
            // for the manager
            if (req.query.franchise_id && req.query.franchise_id !== "All" && req.query.branch_id && req.query.branch_id !== "All") {
                console.log("manager");
                console.log("Inside customer dasboard");
                var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

                // customers and orders of a particular month
                if (req.query.Year && req.query.Year !== "All" && req.query.month && req.query.month !== "All") {
                    const cust_data = await customer.findAll({
                        where: {
                            branch_id: req.query.branch_id
                        }
                    });
                    const ord_data = await orders.findAll({
                        where: {
                            [Op.or]: [
                                { customer_no: cust_data.map((cd) => cd.mobile_no) }
                            ]
                        }
                    });
                    var Total_customers = 0;
                    var Total_orders = 0;
                    for (var i = 0; i < cust_data.length; i++) {
                        if (months[cust_data[i].createdAt.getMonth()] == req.query.month && cust_data[i].createdAt.getFullYear() == req.query.Year) {
                            Total_customers++;
                        }
                    }

                    for (var i = 0; i < ord_data.length; i++) {
                        if (months[ord_data[i].createdAt.getMonth()] == req.query.month && ord_data[i].createdAt.getFullYear() == req.query.Year) {
                            Total_orders++;
                        }
                    }
                    res.json({
                        status: "success",
                        Total_customers: Total_customers,
                        Total_orders: Total_orders
                    })
                }

                // customers and orders of a particular year
                else if (req.query.Year && req.query.Year !== "All" && req.query.month && req.query.month == "All") {
                    const cust_data = await customer.findAll({
                        where: {
                            branch_id: req.query.branch_id
                        }
                    });
                    const ord_data = await orders.findAll({
                        where: {
                            [Op.or]: [
                                { customer_no: cust_data.map((cd) => cd.mobile_no) }
                            ]
                        }
                    });

                    var Total_customers = 0;
                    var Total_orders = 0;
                    for (var i = 0; i < cust_data.length; i++) {
                        if (cust_data[i].createdAt.getFullYear() == req.query.Year) {
                            Total_customers++;
                        }
                    }
                    for (var i = 0; i < ord_data.length; i++) {
                        if (ord_data[i].createdAt.getFullYear() == req.query.Year) {
                            Total_orders++;
                        }
                    }
                    res.json({
                        status: "success",
                        Total_customers: Total_customers,
                        Total_orders: Total_orders
                    })
                }

                // total customers and orders
                else {
                    const cust_data = await customer.findAll({
                        where: {
                            branch_id: req.query.branch_id
                        }
                    });
                    const ord_data = await orders.count({
                        where: {
                            [Op.or]: [
                                { customer_no: cust_data.map((cd) => cd.mobile_no) }
                            ]
                        }
                    });
                    res.json({
                        status: "success",
                        Total_customers: cust_data.length,
                        Total_orders: ord_data
                    });
                }
            }

            // for the regionHead or city head
            else if (req.query.franchise_id && req.query.franchise_id !== "All" && req.query.branch_id == "All") {
                console.log("city/Region head");
                console.log("Inside customer dasboard");
                var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

                if (req.query.Year && req.query.Year !== "All" && req.query.month && req.query.month !== "All") {
                    const all_branches = await branch.findAll({
                        where: {
                            franchise_id: req.query.franchise_id,
                        }
                    });
                    const cust_data = await customer.findAll({
                        where: {
                            [Op.or]: [
                                { branch_id: all_branches.map((b) => b.branch_id) },
                            ]
                        }
                    });
                    const ord_data = await orders.findAll({
                        where: {
                            [Op.or]: [
                                { customer_no: cust_data.map((cd) => cd.mobile_no) }
                            ]
                        }
                    });
                    var Total_customers = 0;
                    var Total_orders = 0;
                    for (var i = 0; i < cust_data.length; i++) {
                        if (months[cust_data[i].createdAt.getMonth()] == req.query.month && cust_data[i].createdAt.getFullYear() == req.query.Year) {
                            Total_customers++;
                        }
                    }

                    for (var i = 0; i < ord_data.length; i++) {
                        if (months[ord_data[i].createdAt.getMonth()] == req.query.month && ord_data[i].createdAt.getFullYear() == req.query.Year) {
                            Total_orders++;
                        }
                    }
                    res.json({
                        status: "success",
                        Total_customers: Total_customers,
                        Total_orders: Total_orders
                    })
                }

                else if (req.query.Year && req.query.Year !== "All" && req.query.month && req.query.month == "All") {
                    const all_branches = await branch.findAll({
                        where: {
                            franchise_id: req.query.franchise_id,
                        }
                    });
                    const cust_data = await customer.findAll({
                        where: {
                            [Op.or]: [
                                { branch_id: all_branches.map((b) => b.branch_id) },
                            ]
                        }
                    });
                    const ord_data = await orders.findAll({
                        where: {
                            [Op.or]: [
                                { customer_no: cust_data.map((cd) => cd.mobile_no) }
                            ]
                        }
                    });
                    var Total_customers = 0;
                    var Total_orders = 0;
                    for (var i = 0; i < cust_data.length; i++) {
                        if (cust_data[i].createdAt.getFullYear() == req.query.Year) {
                            Total_customers++;
                        }
                    }
                    for (var i = 0; i < ord_data.length; i++) {
                        if (ord_data[i].createdAt.getFullYear() == req.query.Year) {
                            Total_orders++;
                        }
                    }
                    res.json({
                        status: "success",
                        Total_customers: Total_customers,
                        Total_orders: Total_orders
                    })
                }

                else {
                    const all_branches = await branch.findAll({
                        where: {
                            franchise_id: req.query.franchise_id,
                        }
                    });
                    const cust_data = await customer.findAll({
                        where: {
                            [Op.or]: [
                                { branch_id: all_branches.map((b) => b.branch_id) },
                            ]
                        }
                    });

                    const ord_data = await orders.count({
                        where: {
                            [Op.or]: [
                                { customer_no: cust_data.map((cd) => cd.mobile_no) }
                            ]
                        }
                    });
                    res.json({
                        status: "success",
                        Total_customers: cust_data.length,
                        Total_orders: ord_data
                    });
                }

            }

            // for the owner or superadmin
            else {
                console.log("owner");
                console.log("Inside customer dasboard");
                var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

                // customers and orders of a particular month
                if (req.query.Year && req.query.Year !== "All" && req.query.month && req.query.month !== "All") {
                    const cust_data = await customer.findAll({});
                    const ord_data = await orders.findAll({});
                    var Total_customers = 0;
                    var Total_orders = 0;
                    for (var i = 0; i < cust_data.length; i++) {
                        if (months[cust_data[i].createdAt.getMonth()] == req.query.month && cust_data[i].createdAt.getFullYear() == req.query.Year) {
                            Total_customers++;
                        }
                    }

                    for (var i = 0; i < ord_data.length; i++) {
                        if (months[ord_data[i].createdAt.getMonth()] == req.query.month && ord_data[i].createdAt.getFullYear() == req.query.Year) {
                            Total_orders++;
                        }
                    }
                    res.json({
                        status: "success",
                        Total_customers: Total_customers,
                        Total_orders: Total_orders
                    })
                }

                // customers and orders of a particular year
                else if (req.query.Year && req.query.Year !== "All" && req.query.month && req.query.month == "All") {
                    const cust_data = await customer.findAll({});
                    const ord_data = await orders.findAll({});
                    var Total_customers = 0;
                    var Total_orders = 0;
                    for (var i = 0; i < cust_data.length; i++) {
                        if (cust_data[i].createdAt.getFullYear() == req.query.Year) {
                            Total_customers++;
                        }
                    }
                    for (var i = 0; i < ord_data.length; i++) {
                        if (ord_data[i].createdAt.getFullYear() == req.query.Year) {
                            Total_orders++;
                        }
                    }
                    res.json({
                        status: "success",
                        Total_customers: Total_customers,
                        Total_orders: Total_orders
                    })
                }

                // total customers and orders
                else {
                    const cust_data = await customer.count({});
                    const ord_data = await orders.count({});
                    res.json({
                        status: "success",
                        Total_customers: cust_data,
                        Total_orders: ord_data
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

    // customer analytics graphp
    async customer_analytics_graph(req, res) {
        try {
            var monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]
            const today = new Date();
            const year = parseInt(req.query.year);
            var month = monthArray.indexOf(req.query.month);
            if (month == -1) month = null;
            const franchise_id = req.query.franchise;
            const branch_id = req.query.branch;
            const filter_by = req.query.filter_by;
            var data;
            /*---------------------- Roles Section -------------------------- */
            // manager condition
            if (franchise_id && franchise_id != "All" && branch_id && branch_id != "All") {
                data = await customer.findAll({
                    where: {
                        branch_id
                    },
                    order: [
                        ['createdAt', 'DESC']
                    ]
                });
            }
            // Region Head and Super Admin / Owner Condition (uuid,all)
            else if (franchise_id && franchise_id != "All" && (!branch_id || branch_id == "All")) {
                const all_branches = await branch.findAll({
                    where: {
                        franchise_id
                    }
                });

                data = await customer.findAll({
                    where: {
                        [Op.or]: [
                            { branch_id: all_branches.map((b) => b.branch_id) }
                        ]
                    },
                    order: [
                        ['createdAt', 'DESC']
                    ]
                });

            }
            // Owner / Super Admin Condition (all,all)
            else {
                data = await customer.findAll({
                    order: [
                        ['createdAt', 'DESC']
                    ]
                });
            }

            /* ------------------  Filters Section ------------------------*/

            // last 24 hrs in 3 hrs interval
            if (filter_by == "today") {
                var xAxis = [];
                var yAxis = [];

                for (var i = 0; i < 24; i += 3) {
                    var no_of_customers = 0;
                    var interval1 = new Date(today.getFullYear(), today.getMonth(), today.getDate(), i);
                    var interval2 = new Date(today.getFullYear(), today.getMonth(), today.getDate(), i + 3);
                    for (var j = 0; j < data.length; j++) {
                        const created_time = new Date(data[j].createdAt);
                        if (created_time >= interval1 && created_time < interval2) {
                            no_of_customers++;
                        }
                    }
                    xAxis.push(i + 3);
                    yAxis.push(no_of_customers);
                }
                res.json({
                    status: "success",
                    X: xAxis,
                    Y: yAxis
                });

            }

            // last 7 days
            else if (filter_by == "weekly") {
                var yAxis = new Array(7).fill(0);
                // X axis
                let dayArr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

                for (var i = 0; i <= 6; i++) {
                    var interval1 = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (i + 1), 0, 0, 0);
                    var interval2 = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (i + 1), 23, 59, 59);
                    var no_of_customers = 0;
                    for (var j = 0; j < data.length; j++) {
                        const created_time = new Date(data[j].createdAt);
                        if (created_time >= interval1 && created_time < interval2) {
                            no_of_customers++;
                        }
                    }
                    // interval1.getday() returns integer 0 - 6 where 0 is Sunday
                    yAxis[interval1.getDay()] = no_of_customers;
                }
                res.json({
                    status: "success",
                    X: dayArr,
                    Y: yAxis
                });

            }

            // sends the data year wise
            else if (filter_by == "yearly") {
                // Send all year wise
                if (year == "All" || !year) {
                    let all_years = [];
                    for (var i = 2017; i <= today.getFullYear(); i++) {
                        all_years.push(i);
                    }

                    for (var i = 0; i < data.length; i++) {
                        const y = new Date(data[i].createdAt).getFullYear();
                        // check if year exists in array
                        if (all_years.indexOf(y) == -1) {
                            all_years.push(y);
                        }
                    }
                    var xAxis = [];
                    var yAxis = [];
                    for (var i = 0; i < all_years.length; i++) {
                        let no_of_customers = 0;
                        for (var j = 0; j < data.length; j++) {
                            const created_time = new Date(data[j].createdAt);
                            if (created_time.getFullYear() == all_years[i]) {
                                no_of_customers++;
                            }
                        }
                        xAxis.push(all_years[i]);
                        yAxis.push(no_of_customers);
                    }
                    res.json({
                        status: "suceess",
                        X: xAxis,
                        Y: yAxis
                    });
                }
                // send all months of particular year
                else {
                    var yAxis = [];
                    for (var i = 0; i < 12; i++) {
                        let no_of_customers = 0;
                        for (var j = 0; j < data.length; j++) {
                            const created_time = new Date(data[j].createdAt);
                            if (created_time.getMonth() == i && created_time.getFullYear() == year) {
                                no_of_customers++;
                            }
                        }
                        yAxis.push(no_of_customers);
                    }
                    res.json({
                        status: "success",
                        X: monthArray,
                        Y: yAxis
                    });
                }
            }

            // Monthly Interval
            else {
                // Send data in 5 days interval of particular month 
                if (req.query.month && req.query.year && req.query.year != "All") {
                    let xAxis = [];
                    let yAxis = [];
                    for (var i = 0; i < 31; i += 5) {
                        let no_of_customers = 0;
                        for (var j = 0; j < data.length; j++) {
                            let created_time = new Date(data[j].createdAt);
                            // console.log(created_time.getFullYear(), " ",year)
                            if (created_time.getFullYear() == year && created_time.getMonth() == month
                                && created_time.getDate() >= i && created_time.getDate() < i + 5) {
                                no_of_customers++;

                            }
                        }
                        xAxis.push(i);
                        yAxis.push(no_of_customers);

                    }
                    res.json({
                        status: "success",
                        x: xAxis,
                        y: yAxis
                    });
                }
                // Send all months of particular year
                else {
                    var yAxis = [];
                    for (var i = 0; i < 12; i++) {
                        let no_of_customers = 0;
                        for (var j = 0; j < data.length; j++) {
                            const created_time = new Date(data[j].createdAt);
                            if (created_time.getMonth() == i && created_time.getFullYear() == year) {
                                no_of_customers++;
                            }
                        }
                        yAxis.push(no_of_customers);
                    }
                    res.json({
                        status: "success",
                        X: monthArray,
                        Y: yAxis
                    });
                }

            }
        }
        catch (err) {
            res.status(500).json({
                status: "failure",
                msg: err
            });

        }
    }

    // customer analytics pie
    async customer_analytics_pie(req, res) {
        // for the manager
        if (req.query.franchise_id && req.query.franchise_id !== "All" && req.query.branch_id && req.query.branch_id !== "All") {
            var key = [];
            var value = [];
            console.log("inside first if in customer analytics pie");
            const data = await customer.count({
                where: {
                    branch_id: req.query.branch_id
                }
            });
            const single_branch = await branch.findOne({
                where: {
                    branch_id: req.query.branch_id
                }
            });
            key.push(single_branch.branch_name);
            value.push(data);
            res.json({
                success: "success",
                data: data,
                key: key,
                value: ["100"]
            });
        }

        // for the regionHead/cityHead
        else if (req.query.franchise_id && req.query.franchise_id !== "All" && req.query.branch_id == "All") {
            console.log("Inside second if in customer analytics pie");
            const all_branches = await branch.findAll({
                where: {
                    franchise_id: req.query.franchise_id
                }
            });

            var key = [];
            var value = [];

            for (var i = 0; i < all_branches.length; i++) {
                const data = await customer.count({
                    where: { branch_id: all_branches[i].branch_id }
                })
                key.push(all_branches[i].branch_name);
                value.push(data);
            }
            var sum = 0;
            for (var i = 0; i < value.length; i++) {
                sum += value[i];
            }
            for (var i = 0; i < value.length; i++) {
                value[i] = ((value[i] / sum) * 100).toFixed(2);
            }

            res.json({
                success: "success",
                key: key,
                value: value
            });
        }

        // for the owner or superadmin
        else {
            const all_branches = await branch.findAll({});

            var key = [];
            var value = [];

            for (var i = 0; i < all_branches.length; i++) {
                const data = await customer.count({
                    where: { branch_id: all_branches[i].branch_id }
                })
                key.push(all_branches[i].branch_name);
                value.push(data);
            }
            var sum = 0;
            for (var i = 0; i < value.length; i++) {
                sum += value[i];
            }
            for (var i = 0; i < value.length; i++) {
                value[i] = ((value[i] / sum) * 100).toFixed(2);
            }
            res.json({
                success: "success",
                key: key,
                value: value
            })

        }
    }

    // order analytics graph
    async order_analytics_graph(req, res) {
        try {
            var monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]
            const today = new Date();
            const year = parseInt(req.query.year);
            var month = monthArray.indexOf(req.query.month);
            if (month == -1) month = null;
            // last 24 hrs
            if (req.query.filter_by == "today") {
                const data = await orders.findAll({
                    where: { customer_no: req.query.customer_no },
                    order: [
                        ['createdAt', 'DESC']
                    ]
                });

                var num_of_sales = 0;
                var yAxis = [];
                var xAxis = [];

                for (var i = 0; i < 24; i += 3) {
                    var interval1 = new Date(today.getFullYear(), today.getMonth(), today.getDate(), i);
                    var interval2 = new Date(today.getFullYear(), today.getMonth(), today.getDate(), i + 3);
                    var order_revenue = 0;
                    for (var j = 0; j < data.length; j++) {
                        const order_time = new Date(data[j].createdAt);
                        if (order_time >= interval1 && order_time < interval2) {
                            num_of_sales++;
                            order_revenue += data[j].paid_price;
                        }
                    }
                    xAxis.push(i + 3);
                    yAxis.push(order_revenue);
                }
                res.json({
                    status: "success",
                    X: xAxis,
                    Y: yAxis,
                    num_of_orders: num_of_sales
                })
            }

            // last 7 days
            else if (req.query.filter_by == "weekly") {

                const data = await orders.findAll({
                    where: { customer_no: req.query.customer_no },
                    order: [
                        ['createdAt', 'DESC']
                    ]
                });

                var num_of_sales = 0;
                let yAxis = new Array(7).fill(0);
                let dayArr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

                for (var i = 0; i <= 6; i++) {
                    var interval1 = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (i + 1), 0, 0, 0);
                    var interval2 = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (i + 1), 23, 59, 59);
                    var sales_revenue = 0;
                    for (var j = 0; j < data.length; j++) {
                        const order_time = new Date(data[j].createdAt);
                        if (order_time >= interval1 && order_time < interval2) {
                            num_of_sales++;
                            sales_revenue += data[j].paid_price;
                        }
                    }
                    sales_revenue = sales_revenue.toFixed(2);
                    yAxis[interval1.getDay()] = sales_revenue;
                }
                res.json({
                    status: "success",
                    X: dayArr,
                    Y: yAxis,
                    num_of_orders: num_of_sales
                });
            }

            // send data by year
            else if (req.query.filter_by == "yearly") {
                // send data of all years
                if (year == "All" || !year) {
                    let all_years = []
                    for (var i = 2017; i <= today.getFullYear(); i++) {
                        all_years.push(i);
                    }

                    const data = await orders.findAll({
                        where: { customer_no: req.query.customer_no }
                    });

                    for (var i = 0; i < data.length; i++) {
                        const y = new Date(data[i].createdAt).getFullYear();
                        // check if year exists in array
                        if (all_years.indexOf(y) == -1) {
                            all_years.push(y);
                        }
                    }

                    var num_of_sales = 0
                    var xAxis = [];
                    var yAxis = [];
                    for (var i = 0; i < all_years.length; i++) {
                        let sales_revenue = 0;
                        for (var j = 0; j < data.length; j++) {
                            const order_year = new Date(data[j].createdAt);
                            if (order_year.getFullYear() == all_years[i]) {
                                num_of_sales++;
                                sales_revenue += data[j].paid_price;
                            }
                        }
                        xAxis.push(all_years[i]);
                        yAxis.push(sales_revenue.toFixed(2));
                    }
                    res.json({
                        status: "suceess",
                        X: xAxis,
                        Y: yAxis,
                        num_of_orders: num_of_sales
                    });
                }
                // sends the data of all months of particular year
                else {
                    const yearStart = new Date(year, 0, 1);
                    const yearEnd = new Date(year, 11, 31);
                    const data = await orders.findAll({
                        where: {
                            customer_no: req.query.customer_no,
                            createdAt: {
                                [Op.between]: [yearStart, yearEnd]
                            }
                        }
                    });
                    var num_of_sales = 0
                    var yAxis = [];
                    for (var i = 0; i < 12; i++) {
                        let sales_revenue = 0;
                        for (var j = 0; j < data.length; j++) {
                            const order_date = new Date(data[j].createdAt);
                            if (order_date.getMonth() == i) {
                                num_of_sales++;
                                sales_revenue += data[j].paid_price;
                            }
                        }
                        yAxis.push(sales_revenue.toFixed(2));
                    }
                    res.json({
                        status: "success",
                        X: monthArray,
                        Y: yAxis,
                        num_of_orders: num_of_sales
                    });
                }
            }

            // Monthly
            else {
                if (req.query.month && req.query.year && req.query.year != "All") {
                    const monthStart = new Date(year, month, 0);
                    const monthEnd = new Date(year, month, 31);
                    const data = await orders.findAll({
                        where: {
                            customer_no: req.query.customer_no,
                            createdAt: {
                                [Op.between]: [monthStart, monthEnd]
                            }
                        }
                    });
                    xAxis = [];
                    yAxis = [];
                    num_of_sales = 0;
                    for (var i = 0; i < 31; i += 5) {
                        let sales_revenue = 0;
                        for (var j = 0; j < data.length; j++) {
                            if (data[j].createdAt.getDate() >= i && data[j].createdAt.getDate() < i + 5) {
                                sales_revenue += data[j].paid_price;
                                num_of_sales++;
                            }
                        }
                        xAxis.push(i);
                        yAxis.push(sales_revenue.toFixed(2));
                    }
                    res.json({
                        status: "success",
                        X: xAxis,
                        Y: yAxis,
                        num_of_orders: num_of_sales
                    });
                }
                // sends the data of all months of particular year
                else {
                    const yearStart = new Date(year, 0, 1);
                    const yearEnd = new Date(year, 11, 31);
                    const data = await orders.findAll({
                        where: {
                            customer_no: req.query.customer_no,
                            createdAt: {
                                [Op.between]: [yearStart, yearEnd]
                            }
                        }
                    });
                    var num_of_sales = 0
                    var yAxis = [];
                    for (var i = 0; i < 12; i++) {
                        let sales_revenue = 0;
                        for (var j = 0; j < data.length; j++) {
                            const order_date = new Date(data[j].createdAt);
                            if (order_date.getMonth() == i) {
                                num_of_sales++;
                                sales_revenue += data[j].paid_price;
                            }
                        }
                        yAxis.push(sales_revenue);
                    }
                    res.json({
                        status: "suceess",
                        X: monthArray,
                        Y: yAxis,
                        num_of_orders: num_of_sales
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


    // fetch_customer_list
    async fetch_customer_list(req, res) {
        try {
            const mobile_no = req.query.mobile_no;
            const name = req.query.name;
            const branch_id = req.query.branch_id;
            const min_price = parseFloat(req.query.min_price);
            console.log("min_price", min_price)
            const max_price = parseFloat(req.query.max_price);
            console.log("max_price", max_price)
            const memb_upg_categ = req.query.memb_upg_categ;
            // const memb_reduce_amount = parseFloat(req.query.memb_reduce_amount);
            const customer_type = req.query.customer_type;
            // const memb_upg_amount = parseFloat(req.query.memb_upg_amount);
            var start_date = req.query.start_date;
            var end_date = req.query.end_date;
            if (start_date) start_date = new Date(start_date);
            if (end_date) end_date = new Date(end_date);
            console.log("start_date", start_date)
            console.log("end_date", end_date)
            var birth_start_date = req.query.birth_start_date;
            var birth_end_date = req.query.birth_end_date;
            var memb_upg_amount_min = req.query.memb_upg_amount_min;
            var memb_upg_amount_max = req.query.memb_upg_amount_max;
            var memb_reduce_amount_min = req.query.memb_reduce_amount_min;
            var memb_reduce_amount_max = req.query.memb_reduce_amount_max;
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
            if (mobile_no) {
                const seperatedQuery = mobile_no
                    .split(" ")
                    .map((item) => `%${item}%`);
                condition.mobile_no = {
                    [Op.iLike]: {
                        [Op.any]: seperatedQuery
                    }
                }
                console.log(condition.mobile_no)
            }
            if (name) {
                const seperatedQuery = name
                    .split(" ")
                    .map((item) => `%${item}%`);
                condition.first_name = {
                    [Op.iLike]: {
                        [Op.any]: seperatedQuery
                    }
                }
                console.log(condition.first_name)
            }
            if (max_price && max_price) {
                console.log("hello")
                condition.total_spend = {
                    [Op.and]: {
                        [Op.gte]: min_price,
                        [Op.lte]: max_price
                    }
                }
            }
            if (memb_upg_amount_min && memb_upg_amount_max) {
                condition.memb_upg_amount = {
                    [Op.and]: {
                        [Op.gte]: memb_upg_amount_min,
                        [Op.lte]: memb_upg_amount_max
                    }
                }
            }
            if (branch_id) {
                condition.branch_id = branch_id

            }
            if (memb_reduce_amount_min && memb_reduce_amount_max) {
                condition.memb_reduce_amount = {
                    [Op.and]: {
                        [Op.gte]: memb_reduce_amount_min,
                        [Op.lte]: memb_reduce_amount_max
                    }
                }

            }
            if (customer_type) {
                condition.customer_type = customer_type

            }
            if (memb_upg_categ) {
                condition.memb_upg_categ = memb_upg_categ
            }
            if (start_date && end_date) {
                condition.createdAt = {
                    [Op.between]: [start_date, end_date]
                }
            }
            if (birth_start_date && birth_end_date) {
                condition.date_of_birth = {
                    [Op.between]: [birth_start_date, birth_end_date]
                }
            }
            console.log(condition)
            var data = await customer.findAll({
                offset: pgnum, limit: per_page,
                where: condition
            });
            var total_customer_count = await customer.count({
                where: condition
            });
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
            const mobile_no = req.query.mobile_no;
            const name = req.query.name;
            const branch_id = req.query.branch_id;
            const min_price = parseFloat(req.query.min_price);
            console.log("min_price", min_price)
            const max_price = parseFloat(req.query.max_price);
            console.log("max_price", max_price)
            const memb_upg_categ = req.query.memb_upg_categ;
            const memb_reduce_amount = parseFloat(req.query.memb_reduce_amount);
            const customer_type = req.query.customer_type;
            const memb_upg_amount = parseFloat(req.query.memb_upg_amount);
            var start_date = req.query.start_date;
            var end_date = req.query.end_date;
            if (start_date) start_date = new Date(start_date);
            if (end_date) end_date = new Date(end_date);
            console.log("start_date", start_date)
            console.log("end_date", end_date)
            var birth_start_date = req.query.birth_start_date;
            var birth_end_date = req.query.birth_end_date;
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
            if (mobile_no) {
                const seperatedQuery = mobile_no
                    .split(" ")
                    .map((item) => `%${item}%`);
                condition.mobile_no = {
                    [Op.iLike]: {
                        [Op.any]: seperatedQuery
                    }
                }
                console.log(condition.mobile_no)
            }
            if (name) {
                const seperatedQuery = name
                    .split(" ")
                    .map((item) => `%${item}%`);
                condition.first_name = {
                    [Op.iLike]: {
                        [Op.any]: seperatedQuery
                    }
                }
                console.log(condition.first_name)
            }
            if (max_price && max_price) {
                console.log("hello")
                condition.total_spend = {
                    [Op.and]: {
                        [Op.gte]: min_price,
                        [Op.lte]: max_price
                    }
                }
            }
            if (memb_upg_categ) {
                condition.memb_upg_categ =
                    memb_upg_categ
            }
            if (branch_id) {
                condition.branch_id = branch_id

            }
            if (memb_reduce_amount) {
                condition.memb_reduce_amount = memb_reduce_amount

            }
            if (customer_type) {
                condition.customer_type = customer_type

            }
            if (memb_upg_amount) {
                condition.memb_upg_amount = memb_upg_amount
            }
            if (start_date && end_date) {
                condition.createdAt = {
                    [Op.between]: [start_date, end_date]
                }
            }
            if (birth_start_date && birth_end_date) {
                condition.date_of_birth = {
                    [Op.between]: [birth_start_date, birth_end_date]
                }
            }
            console.log(condition)
            var all_customers = await customer.findAll({
                where: condition
            });
            // check if customer group exists
            if (all_customers.length == 0) {
                res.json({
                    status: "failure",
                    msg: "No Members"
                });
            } else {
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
                    const obj = []
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


    // fetch customers according to the roles 
    async fetch_customers(req, res) {
        try {
            var pgnum = req.params.no;
            var per_page = 10;
            if (!pgnum) {
                pgnum = 0;
            } else if (pgnum > 0) {
                pgnum = (pgnum - 1) * per_page;
            } else {
                pgnum = 0;
            }

            // for the manager
            if (req.query.franchise_id && req.query.franchise_id !== "All" && req.query.branch_id && req.query.branch_id !== "All") {
                console.log("inside mngr");
                if (req.query.search) {
                    var search = req.query.search;
                    const seperatedQuery = search
                        .split(" ")
                        .map((item) => `%${item}%`);
                    console.log(seperatedQuery);
                    const data = await customer.findAll({
                        offset: pgnum, limit: per_page,
                        where: {
                            branch_id: req.query.branch_id,
                            [Op.and]: {
                                [Op.or]: {
                                    first_name: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    last_name: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    mobile_no: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    email: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    branch: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    customer_type: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                }
                            },
                        }
                    });

                    const total_customers = await customer.count({
                        where: {
                            branch_id: req.query.branch_id
                        }
                    });
                    if (data.length != 0) {
                        res.json({
                            status: "success",
                            data: data,
                            total_customers: total_customers
                        });
                    }
                    else {
                        res.json({
                            status: "failure",
                            msg: "No employees found !"
                        });
                    }

                }
                else {
                    const data = await customer.findAll({
                        offset: pgnum, limit: per_page,
                        where: {
                            branch_id: req.query.branch_id
                        }
                    });

                    const total_customers = await customer.count({
                        where: {
                            branch_id: req.query.branch_id
                        }
                    });
                    if (data.length != 0) {
                        res.json({
                            status: "success",
                            data: data,
                            total_customers: total_customers
                        });
                    }
                    else {
                        res.json({
                            status: "failure",
                            msg: "No employees found !"
                        });
                    }

                }
            }
            // for the region head and city head
            else if (req.query.franchise_id && req.query.franchise_id !== "All" && req.query.branch_id == "All") {
                // region is passed
                // if(req.query.role == "Region Head"){
                console.log("inside region head");
                // const region = req.query.region;
                if (req.query.search) {
                    console.log("Inside search");
                    var search = req.query.search;
                    const seperatedQuery = search
                        .split(" ")
                        .map((item) => `%${item}%`);
                    console.log(seperatedQuery);

                    const all_branches = await branch.findAll({
                        where: {
                            franchise_id: req.query.franchise_id,
                            // region:region
                        }
                    });
                    const data = await customer.findAll({
                        offset: pgnum, limit: per_page,
                        where: {
                            [Op.or]: [
                                { branch_id: all_branches.map((b) => b.branch_id) },
                            ],
                            [Op.and]: {
                                [Op.or]: {
                                    first_name: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    last_name: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    mobile_no: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    email: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    branch: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    customer_type: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                }
                            },



                        }
                    });
                    const total_customers = await customer.count({
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
                            total_customers: total_customers
                        });
                    }
                    else {
                        res.json({
                            status: "success",
                            data: data,
                            total_customer: total_customers
                        });
                    }

                }
                else {
                    const all_branches = await branch.findAll({
                        where: {
                            franchise_id: req.query.franchise_id,
                            // region:region
                        }
                    });
                    const data = await customer.findAll({
                        offset: pgnum, limit: per_page,
                        where: {
                            [Op.or]: [
                                { branch_id: all_branches.map((b) => b.branch_id) }
                            ]
                        }
                    });
                    const total_customers = await customer.count({
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
                            total_customers: total_customers
                        });
                    }
                    else {
                        res.json({
                            status: "success",
                            data: data,
                            total_customer: total_customers
                        });
                    }
                }

                // }

                // city is passed
                // else if(req.query.role == "City Head"){
                //     console.log("inside city head");
                //     const city = req.query.city;
                //     if(req.query.search){
                //         console.log("Inside search");
                //         var search = req.query.search;
                //         const seperatedQuery = search
                //         .split(" ")
                //         .map((item) => `%${item}%`);
                //         console.log(seperatedQuery);

                //         const all_branches = await branch.findAll({
                //             where:{
                //                 franchise_id:req.query.franchise_id,
                //                 city : city
                //             }
                //         });
                //         const data = await customer.findAll({
                //             offset: pgnum,limit:per_page,
                //             where:{
                //                 [Op.or]:[
                //                     {branch_id:all_branches.map((b) => b.branch_id)}
                //                 ],
                //                 [Op.and] : {
                //                     [Op.or] : {
                //                         first_name : {[Op.iLike] : {[Op.any] : seperatedQuery}},
                //                         last_name : {[Op.iLike] : {[Op.any] : seperatedQuery}},
                //                         mobile_no : {[Op.iLike] : {[Op.any] : seperatedQuery}},
                //                         email : {[Op.iLike] : {[Op.any] : seperatedQuery}},
                //                         branch : {[Op.iLike] : {[Op.any] : seperatedQuery}},
                //                         customer_type : {[Op.iLike] : {[Op.any] : seperatedQuery}},
                //                     }
                //                 },

                //             }
                //         });
                //         const total_customers = await customer.count({
                //             where:{
                //                 [Op.or]:[
                //                     {branch_id:all_branches.map((b) => b.branch_id)}
                //                 ]
                //             }
                //         });
                //         if(data.length != 0){
                //             res.json({
                //                 status:"success",
                //                 data : data,
                //                 total_customers:total_customers
                //             });
                //         }

                //     }
                //     else{
                //         const all_branches = await branch.findAll({
                //             where:{
                //                 franchise_id:req.query.franchise_id,
                //                 city : city
                //             }
                //         });
                //         const data = await customer.findAll({
                //             offset: pgnum,limit:per_page,
                //             where:{
                //                 [Op.or]:[
                //                     {branch_id:all_branches.map((b) => b.branch_id)}
                //                 ],

                //             }
                //         });
                //         const total_customers = await customer.count({
                //             where:{
                //                 [Op.or]:[
                //                     {branch_id:all_branches.map((b) => b.branch_id)}
                //                 ]
                //             }
                //         });
                //         if(data.length != 0){
                //             res.json({
                //                 status:"success",
                //                 data : data,
                //                 total_customers:total_customers
                //             });
                //         }

                //     }
                // }

                // id is passed
                // else{
                //     console.log("inside region and city");
                //     const all_branches = await branch.findAll({
                //         where:{franchise_id:req.query.franchise_id}
                //     });
                //     const data = await customer.findAll({
                //         offset: pgnum,limit:per_page,
                //         where:{
                //             [Op.or] : [
                //                 {branch_id:all_branches.map((b) => b.branch_id)}
                //             ]
                //         }
                //     });
                //     const total_customers = await customer.count({
                //         where:{
                //             [Op.or] : [
                //                 {branch_id:all_branches.map((b) => b.branch_id)}
                //             ]
                //         }
                //     });
                //     if(data.length != 0){
                //         res.json({
                //             status:"success",
                //             data : data,
                //             total_customers : total_customers
                //         });
                //     }
                //     else{
                //         res.json({
                //             status:"failure",
                //             msg:"no data found !"
                //         });
                //     }
                // }
            }

            // for the owner and admin
            else {
                console.log("inside owner");
                if (req.query.search) {
                    console.log("Inside query Search");
                    var search = req.query.search;
                    const seperatedQuery = search
                        .split(" ")
                        .map((item) => `%${item}%`);
                    console.log(seperatedQuery)

                    const data = await customer.findAll({
                        offset: pgnum, limit: per_page,
                        where: {
                            [Op.and]: {
                                [Op.or]: {
                                    first_name: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    last_name: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    mobile_no: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    email: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    branch: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                    customer_type: { [Op.iLike]: { [Op.any]: seperatedQuery } },
                                }
                            },
                        },
                    });
                    const total_customers = await customer.count();
                    if (data.length != 0) {
                        res.json({
                            status: "success",
                            data: data,
                            total_customers: total_customers
                        });
                    }
                    else {
                        res.json({
                            status: "failure",
                            msg: "no data found !"
                        });
                    }
                }
                else {
                    const data = await customer.findAll({
                        offset: pgnum, limit: per_page
                    });
                    const total_customers = await customer.count();
                    if (data.length != 0) {
                        res.json({
                            status: "success",
                            data: data,
                            total_customers: total_customers
                        });
                    }
                    else {
                        res.json({
                            status: "failure",
                            msg: "no data found !"
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

    // new customer
    async add_customer(req, res) {
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
            if (req.body.password) {
                req.body.password = await bcrypt.hash(req.body.password, 10);
            }
            if (req.body.customer_type) {
                let customer_role = await customer_roles.findAll({
                    order: [
                        ["min_purchase", "ASC"]
                    ],
                    raw: true
                })
                var pos = customer_role.findIndex(i => i.customer_type == req.body.customer_type);
                console.log("pos", pos)
                if (pos == (customer_role.length - 1)) {
                    req.body.memb_upg_categ = null
                } else {
                    req.body.memb_upg_categ = customer_role[pos + 1].customer_type
                }
                req.body.memb_upg_amount = customer_role[pos].upg_purchase
                req.body.start_date = new Date().toISOString().slice(0, 10);
                req.body.memb_days_left = customer_role[pos].upg_days
                req.body.memb_reduce_amount = customer_role[pos].reduce_purchase
                req.body.memb_amount = 0;
            }
            const customer_details = await customer.create(req.body);
            res.json({ "status": "success", "customer": customer_details });
        }
        catch (e) {
            console.log(e)
            res.status(500).json({ "status": "failure", "msg": e });
        }
    }
    // average purchase
    async avg_purchase(req, res) {
        try {
            const today = new Date();
            if (req.query.filter_by == "weekly") {
                const data = await orders.findAll({
                    where: { customer_no: req.query.customer_no },
                    order: [
                        ['createdAt', 'DESC']
                    ]
                });

                var avg_purchase = 0;
                for (var i = 0; i <= 6; i++) {
                    var interval1 = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (i + 1), 0, 0, 0);
                    var interval2 = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (i + 1), 23, 59, 59);
                    for (var j = 0; j < data.length; j++) {
                        const order_time = new Date(data[j].dataValues.createdAt);
                        if (order_time >= interval1 && order_time < interval2) {
                            avg_purchase += data[j].paid_price;
                        }
                    }
                }
                res.json({
                    success: "success",
                    avg_revenue: (avg_purchase / 7).toFixed(0)
                });
            }

            if (req.query.filter_by == "monthly") {
                const thisMonth = today.getMonth();
                const data = await orders.findAll({
                    where: { customer_no: req.query.customer_no }
                });
                var avg_purchase = 0;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].createdAt.getMonth() == thisMonth) {
                        avg_purchase += data[i].paid_price;
                    }
                }
                res.json({
                    success: "success",
                    avg_purchase: (avg_purchase / 30).toFixed(0)
                });
            }

            if (req.query.filter_by == "yearly") {
                const thisYear = today.getFullYear();
                const data = await orders.findAll({
                    where: { customer_no: req.query.customer_no }
                });
                var avg_purchase = 0;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].createdAt.getFullYear() == thisYear) {
                        avg_purchase += data[i].paid_price;
                    }
                }
                res.json({
                    success: "success",
                    avg_purchase: (avg_purchase / 362).toFixed(0)
                });
            }

        }
        catch (err) {
            console.log(err);
            res.status(500).json({
                status: "failure",
                msg: err

            })

        }
    }

    // update_single_customer
    async update_single_customer(req, res) {
        try {
            const customer_exist = await customer.findOne({ where: { mobile_no: req.body.mobile_no } });
            if (customer_exist) {
                if (req.body.password) {
                    req.body.password = await bcrypt.hash(req.body.password, 10);
                }
                if (req.body.customer_type) {
                    let customer_role = await customer_roles.findAll({
                        order: [
                            ["min_purchase", "ASC"]
                        ],
                        raw: true
                    })
                    var pos = customer_role.findIndex(i => i.customer_type == req.body.customer_type);
                    console.log("pos", pos)
                    if (pos == (customer_role.length - 1)) {
                        req.body.memb_upg_categ = null
                    } else {
                        req.body.memb_upg_categ = customer_role[pos + 1].customer_type
                    }
                    req.body.memb_upg_amount = customer_role[pos].upg_purchase
                    req.body.start_date = new Date().toISOString().slice(0, 10);
                    req.body.memb_days_left = customer_role[pos].upg_days
                    req.body.memb_reduce_amount = customer_role[pos].reduce_purchase
                    req.body.memb_amount = 0;
                }
                const update_customer = await customer.update(req.body, {
                    where: {
                        mobile_no: req.body.mobile_no
                    }
                });
                if (update_customer[0]) {
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

    async fetch_customer_roles(req, res) {
        try {
            const all_customer_roles = await customer_roles.findAll({
            });
            res.status(200).json({
                status: "success",
                all_customer_roles
            });
        }
        catch (err) {
            res.json({
                status: "failure",
                msg: err
            });
        }
    }

    async fetch_single_customer(req, res) {
        try {
            const customer_no = req.query.customer_no;
            const data = await customer.findOne({
                where: {
                    mobile_no: customer_no
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

}


module.exports = new adminCustomerController();