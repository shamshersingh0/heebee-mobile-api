const sequelize = require("sequelize");
const Op = sequelize.Op;
const { employee, orders, order_items, franchise, branch
} = require("../models");
// async function dummy(){
    // const results = await orders.findAll({
    //     where: {
    //       [Op.and] : [
    //          sequelize.fn('EXTRACT(YEAR from "createdAt") =', 2022),
    //          sequelize.fn('EXTRACT(MONTH from "createdAt") =', 5)
    //       ]
    //     }
    //   });
    //   console.log(results.length)
//     const results = await orders.findAll({
//         where: {
//             status:{
//                 [Op.not]:"Cancelled"
//             },
//             [Op.and]:[
//                 sequelize.fn('EXTRACT(YEAR from "createdAt") =', 2022),
//                 sequelize.fn('EXTRACT(MONTH from "createdAt") =', 5)
//             ], 
//         },
//         attributes: [
//             [(sequelize.fn('SUM', sequelize.col('paid_price'))), 'total_sales_revenue'],
//             [sequelize.fn('COUNT', sequelize.col('paid_price')), 'total_orders']
//         ],
//      });
//      console.log(results)
// }
// dummy();

class adminDashboardHomeController {

    async dashboard_analytics(req, res) {
        try {
            // create month map with indexes
            const monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const year = parseInt(req.query.year);
            //console.log(year)
            var month = req.query.month;
            const franchise_id = req.query.franchise;
            const branch_id = req.query.branch;

            // Manager Condition (uuid,uuid)
            if (franchise_id && franchise_id != "All" && branch_id && branch_id != "All") {
                //console.log("Hello1");
                // year and month not all condition eg. (2020,Jan)
                if (year && year != "All" && month && month != "All") {
                    console.log("Hello2");
                    month = monthArray.indexOf(req.query.month)
                    const all_orders = await orders.findAll({
                        where: { branch_id, status: { [Op.not]: "Cancelled" } },
                    });
                    var num_of_sales = 0;
                    var sales_revenue = 0;
                    for (var i = 0; i < all_orders.length; i++) {
                        const order_date = new Date(all_orders[i].dataValues.createdAt);
                        if (order_date.getFullYear() == year && order_date.getMonth() == month) {
                            console.log(order_date.getFullYear(), order_date.getMonth());
                            num_of_sales++;
                            sales_revenue += all_orders[i].dataValues.paid_price;
                        }
                    }
                    const avg_sales_per_day = (num_of_sales / 30).toFixed(2);
                    if (all_orders.length != 0) {
                        res.json({
                            status: "success",
                            num_of_sales: num_of_sales,
                            sales_revenue: sales_revenue,
                            avg_sales_per_day: avg_sales_per_day
                        })
                    }
                    else {
                        res.json({
                            status: "failure",
                            msg: "no data found"
                        });
                    }
                }
                // year not all and month all condition eg. (2020,all) & (2020,null)
                else if (year && year != "All" && month == "All" || !month) {
                    console.log("Hello3");
                    const all_orders = await orders.findAll({
                        where: { branch_id, status: { [Op.not]: "Cancelled" } },
                    });
                    var num_of_sales = 0;
                    var sales_revenue = 0;
                    for (var i = 0; i < all_orders.length; i++) {
                        const order_date = new Date(all_orders[i].dataValues.createdAt);
                        if (order_date.getFullYear() == year) {
                            num_of_sales++;
                            sales_revenue += all_orders[i].dataValues.paid_price;
                        }
                    }
                    //const avg_sales_per_day = (num_of_sales / 30).toFixed(2);
                    if (all_orders.length != 0) {
                        res.json({
                            status: "success",
                            num_of_sales: num_of_sales,
                            sales_revenue: sales_revenue,
                            //avg_sales_per_day:avg_sales_per_day
                        })
                    }
                    else {
                        res.json({
                            status: "failure",
                            msg: "no data found"
                        });
                    }
                }
                // year all and month not all condition eg. (all,Jan) & (null,Jan)
                else if (year == "All" || !year && month && month != "All") {
                    console.log("Hello4");
                    month = monthArray.indexOf(req.query.month)
                    const all_orders = await orders.findAll({
                        where: { branch_id, status: { [Op.not]: "Cancelled" } },
                    });
                    var num_of_sales = 0;
                    var sales_revenue = 0;
                    for (var i = 0; i < all_orders.length; i++) {
                        const order_date = new Date(all_orders[i].dataValues.createdAt);
                        if (order_date.getMonth() == month) {
                            num_of_sales++;
                            sales_revenue += all_orders[i].dataValues.paid_price;
                        }
                    }
                    //const avg_sales_per_day = (num_of_sales / 30).toFixed(2);
                    if (all_orders.length != 0) {
                        res.json({
                            status: "success",
                            num_of_sales: num_of_sales,
                            sales_revenue: sales_revenue,
                            //avg_sales_per_day:avg_sales_per_day
                        })
                    }
                    else {
                        res.json({
                            status: "failure",
                            msg: "no data found"
                        });
                    }
                }
                // year all and month all condition eg. (all,all)
                else {
                    console.log("Hello5");
                    const all_orders = await orders.findAll({
                        where: { branch_id, status: { [Op.not]: "Cancelled" } },
                    });
                    var num_of_sales = 0;
                    var sales_revenue = 0;
                    for (var i = 0; i < all_orders.length; i++) {
                        num_of_sales++;
                        sales_revenue += all_orders[i].dataValues.paid_price;
                    }
                    //const avg_sales_per_day = (num_of_sales / 30).toFixed(2);
                    if (all_orders.length != 0) {
                        res.json({
                            status: "success",
                            num_of_sales: num_of_sales,
                            sales_revenue: sales_revenue,
                            //avg_sales_per_day:avg_sales_per_day
                        })
                    }
                    else {
                        res.json({
                            status: "failure",
                            msg: "no data found"
                        });
                    }
                }
            }
            // Region Head and Super Admin / Owner Condition (uuid,all)
            else if (franchise_id && franchise_id != "All" && branch_id == "All") {
                const all_branches = await branch.findAll({
                    where: {
                        franchise_id
                    }
                });
                // year and month not all condition eg. (2020,Jan)
                if (year && year != "All" && month && month != "All") {
                    month = monthArray.indexOf(req.query.month)
                    const all_orders = await orders.findAll({
                        where: {
                            [Op.or]: [
                                { branch_id: all_branches.map((b) => b.branch_id) }
                            ],
                            status: { [Op.not]: "Cancelled" }
                        }
                    });
                    var num_of_sales = 0;
                    var sales_revenue = 0;
                    for (var i = 0; i < all_orders.length; i++) {
                        const order_date = new Date(all_orders[i].dataValues.createdAt);
                        if (order_date.getFullYear() == year && order_date.getMonth() == month) {
                            num_of_sales++;
                            sales_revenue += all_orders[i].dataValues.paid_price;
                        }
                    }
                    const avg_sales_per_day = (num_of_sales / 30).toFixed(2);
                    if (all_orders.length != 0) {
                        res.json({
                            status: "success",
                            num_of_sales: num_of_sales,
                            sales_revenue: sales_revenue,
                            avg_sales_per_day: avg_sales_per_day
                        })
                    }
                    else {
                        res.json({
                            status: "failure",
                            msg: "no data found"
                        });
                    }
                }
                // year not all and month all condition eg. (2020,all) & (2020,null)
                else if (year && year != "All" && month == "All" || !month) {
                    const yearstart = new Date(year, 0, 1);
                    const yearEnd = new Date(year, 11, 31);
                    var sales_revenue = await orders.sum("paid_price",{
                        where: {
                            [Op.or]: [
                                { branch_id: all_branches.map((b) => b.branch_id) }
                            ],
                            status: { [Op.not]: "Cancelled" },
                            createdAt: {
                                [Op.between]: [yearstart, yearEnd]
                            }
                        }
                    });
                    var num_of_sales = await orders.count({
                        where: {
                            [Op.or]: [
                                { branch_id: all_branches.map((b) => b.branch_id) }
                            ],
                            status: { [Op.not]: "Cancelled" },
                            createdAt: {
                                [Op.between]: [yearstart, yearEnd]
                            }
                        }
                    });
                    const firstOrder = await orders.findOne({
                        where:{
                            [Op.or]: [
                                { branch_id: all_branches.map((b) => b.branch_id) }
                            ],
                            status: { [Op.not]: "Cancelled" },
                            createdAt: {
                                [Op.between]: [yearstart, yearEnd]
                            }
                        },
                        order:[
                            ["createdAt","ASC"]
                        ]
                    });
                    const lastOrder = await orders.findOne({
                        where:{
                            [Op.or]: [
                                { branch_id: all_branches.map((b) => b.branch_id) }
                            ],
                            status: { [Op.not]: "Cancelled" },
                            createdAt: {
                                [Op.between]: [yearstart, yearEnd]
                            }
                        },
                        order:[
                            ["createdAt","DESC"]
                        ]
                    }); 
                    if(num_of_sales != 0){
                        var diff_in_days = Math.round((new Date(lastOrder.dataValues.createdAt) - new Date(firstOrder.dataValues.createdAt)) / (1000 * 60 * 60 * 24));

                        if(!diff_in_days) diff_in_days = 365;
                        const avg_sales_per_day = (num_of_sales / diff_in_days).toFixed(2);
            
                        res.json({
                            status: "success",
                            num_of_sales: num_of_sales,
                            sales_revenue: sales_revenue,
                            avg_sales_per_day:avg_sales_per_day
                        });
                    }
                    else{
                        res.json({
                            status:"success",
                            num_of_sales: 0,
                            sales_revenue: 0,
                            avg_sales_per_day:0    
                        })
                    }
                }
                // year all and month not all condition eg. (all,Jan) & (null,Jan)
                else if (year == "All" || !year && month && month != "All") {
                    month = monthArray.indexOf(req.query.month)
                    const all_orders = await orders.findAll({
                        where: {
                            [Op.or]: [
                                { branch_id: all_branches.map((b) => b.branch_id) }
                            ],
                            status: { [Op.not]: "Cancelled" }
                        }
                    });
                    var num_of_sales = 0;
                    var sales_revenue = 0;
                    for (var i = 0; i < all_orders.length; i++) {
                        const order_date = new Date(all_orders[i].dataValues.createdAt);
                        if (order_date.getMonth() == month) {
                            num_of_sales++;
                            sales_revenue += all_orders[i].dataValues.paid_price;
                        }
                    }
                    const avg_sales_per_day = (num_of_sales / 30).toFixed(2);
                    if (all_orders.length != 0) {
                        res.json({
                            status: "success",
                            num_of_sales: num_of_sales,
                            sales_revenue: sales_revenue,
                            avg_sales_per_day:avg_sales_per_day
                        })
                    }
                    else {
                        res.json({
                            status: "failure",
                            msg: "no data found"
                        });
                    }
                }
                // year all and month all condition eg. (all,all)
                else {
                    const all_orders = await orders.findAll({
                        where: {
                            [Op.or]: [
                                { branch_id: all_branches.map((b) => b.branch_id) }
                            ],
                            status: { [Op.not]: "Cancelled" }
                        }
                    });
                    var num_of_sales = 0;
                    var sales_revenue = 0;
                    for (var i = 0; i < all_orders.length; i++) {
                        num_of_sales++;
                        sales_revenue += all_orders[i].dataValues.paid_price;
                    }
                    //const avg_sales_per_day = (num_of_sales / 30).toFixed(2);
                    if (all_orders.length != 0) {
                        res.json({
                            status: "success",
                            num_of_sales: num_of_sales,
                            sales_revenue: sales_revenue,
                            //avg_sales_per_day:avg_sales_per_day
                        })
                    }
                    else {
                        res.json({
                            status: "failure",
                            msg: "no data found"
                        });
                    }
                }
            }
            // Owner / Super Admin Condition (all,all)
            else {
                // year and month not all condition eg. (2020,Jan)
                if (year && year != "All" && month && month != "All") {
                    month = monthArray.indexOf(req.query.month)
                    const all_orders = await orders.findAll({
                        where: { status: { [Op.not]: "Cancelled" } },
                    });
                    var num_of_sales = 0;
                    var sales_revenue = 0;
                    for (var i = 0; i < all_orders.length; i++) {
                        const order_date = new Date(all_orders[i].dataValues.createdAt);
                        if (order_date.getFullYear() == year && order_date.getMonth() == month) {
                            num_of_sales++;
                            sales_revenue += all_orders[i].dataValues.paid_price;
                        }
                    }
                    const avg_sales_per_day = (num_of_sales / 30).toFixed(2);
                    if (all_orders.length != 0) {
                        res.json({
                            status: "success",
                            num_of_sales: num_of_sales,
                            sales_revenue: sales_revenue,
                            avg_sales_per_day: avg_sales_per_day
                        })
                    }
                    else {
                        res.json({
                            status: "failure",
                            msg: "no data found"
                        });
                    }
                }
                // year not all and month all condition eg. (2020,all) & (2020,null)
                else if (year && year != "All" && month == "All" || !month) {
                    const all_orders = await orders.findAll({
                        where: { status: { [Op.not]: "Cancelled" } },
                    });
                    var num_of_sales = 0;
                    var sales_revenue = 0;
                    for (var i = 0; i < all_orders.length; i++) {
                        const order_date = new Date(all_orders[i].dataValues.createdAt);
                        if (order_date.getFullYear() == year) {
                            num_of_sales++;
                            sales_revenue += all_orders[i].dataValues.paid_price;
                        }
                    }
                    //const avg_sales_per_day = (num_of_sales / 30).toFixed(2);
                    if (all_orders.length != 0) {
                        res.json({
                            status: "success",
                            num_of_sales: num_of_sales,
                            sales_revenue: sales_revenue,
                            //avg_sales_per_day:avg_sales_per_day
                        })
                    }
                    else {
                        res.json({
                            status: "failure",
                            msg: "no data found"
                        });
                    }
                }
                // year all and month not all condition eg. (all,Jan) & (null,Jan)
                else if (year == "All" || !year && month && month != "All") {
                    month = monthArray.indexOf(req.query.month)
                    const all_orders = await orders.findAll({
                        where: { status: { [Op.not]: "Cancelled" } },
                    });
                    var num_of_sales = 0;
                    var sales_revenue = 0;
                    for (var i = 0; i < all_orders.length; i++) {
                        const order_date = new Date(all_orders[i].dataValues.createdAt);
                        if (order_date.getMonth() == month) {
                            num_of_sales++;
                            sales_revenue += all_orders[i].dataValues.paid_price;
                        }
                    }
                    //const avg_sales_per_day = (num_of_sales / 30).toFixed(2);
                    if (all_orders.length != 0) {
                        res.json({
                            status: "success",
                            num_of_sales: num_of_sales,
                            sales_revenue: sales_revenue,
                            //avg_sales_per_day:avg_sales_per_day
                        })
                    }
                    else {
                        res.json({
                            status: "failure",
                            msg: "no data found"
                        });
                    }
                }
                // year all and month all condition eg. (all,all)
                else {
                    const all_orders = await orders.findAll({
                        where: { status: { [Op.not]: "Cancelled" } },
                    });
                    var num_of_sales = 0;
                    var sales_revenue = 0;
                    for (var i = 0; i < all_orders.length; i++) {
                        num_of_sales++;
                        sales_revenue += all_orders[i].dataValues.paid_price;
                    }
                    //const avg_sales_per_day = (num_of_sales / 30).toFixed(2);
                    if (all_orders.length != 0) {
                        res.json({
                            status: "success",
                            num_of_sales: num_of_sales,
                            sales_revenue: sales_revenue,
                            //avg_sales_per_day:avg_sales_per_day
                        })
                    }
                    else {
                        res.json({
                            status: "failure",
                            msg: "no data found"
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

    async revenue_graph(req, res) {
        try {
            const monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const year = parseInt(req.query.year);
            var month = monthArray.indexOf(req.query.month);
            if (month == -1) month = null;
            const franchise_id = req.query.franchise;
            const branch_id = req.query.branch;
            const role = req.query.role;
            const filter_by = req.query.filter_by;
            const today = new Date();
            // get sales this year

            // console.log(today.getDate(),today.getHours(),today.getMinutes())
            // Manager Condition (uuid,uuid)
            if (franchise_id && franchise_id != "All" && branch_id && branch_id != "All") {
                // For Bottom Three Fields
                const all_orders = await orders.findAll({
                    where: {
                        branch_id: branch_id,
                        status: { [Op.not]: "Cancelled" }
                    }
                });
                // For Bottom Three Fields
                var revenue_this_month = 0;
                var revenue_this_year = 0;
                var revenue_prev_year = 0;
                for (var j = 0; j < all_orders.length; j++) {
                    const order_month = new Date(all_orders[j].dataValues.createdAt);
                    const order_year = new Date(all_orders[j].dataValues.createdAt);
                    if (order_month.getMonth() == today.getMonth()) {
                        revenue_this_month += all_orders[j].dataValues.paid_price;
                    }
                    if (order_year.getFullYear() == today.getFullYear()) {
                        revenue_this_year += all_orders[j].dataValues.paid_price;
                    }
                    if (order_year.getFullYear() == (today.getFullYear() - 1)) {
                        revenue_prev_year += all_orders[j].dataValues.paid_price;
                    }
                }
                var diff = revenue_prev_year - revenue_this_year;
                //console.log(diff);
                var this_year = {}
                var percentage;
                if (revenue_prev_year != 0) {
                    percentage = ((Math.abs(diff) / revenue_prev_year) * 100).toFixed(2);
                }
                else {
                    percentage = 100;
                }
                this_year["revenue"] = revenue_this_year.toFixed(2);
                if (diff >= 0)
                    this_year["percentage"] = `-${percentage}%`;
                else
                    this_year["percentage"] = `+${percentage}%`;

                // 3 hrs interval
                if (filter_by == "today") {

                    const all_orders = await orders.findAll({
                        where: {
                            branch_id: branch_id,
                            status: { [Op.not]: "Cancelled" }
                        },
                        order: [
                            ['createdAt', 'DESC']
                        ]
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
                        Y.push(sales_revenue.toFixed(2));
                    }
                    // const avg_sales_per_day = (num_of_sales / 30).toFixed(2);
                    if (all_orders.length != 0) {
                        res.json({
                            status: "success",
                            num_of_sales: num_of_sales,
                            sales_revenue: sales_revenue.toFixed(2),
                            this_year: this_year,
                            prev_year: revenue_prev_year.toFixed(2),
                            this_month: revenue_this_month.toFixed(2),
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
                        where: {
                            branch_id: branch_id,
                            status: { [Op.not]: "Cancelled" }
                        },
                        order: [
                            ['createdAt', 'DESC']
                        ]
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
                            this_year: this_year,
                            prev_year: revenue_prev_year.toFixed(2),
                            this_month: revenue_this_month.toFixed(2),
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
                    if (year == "All" || !year) {
                        let all_years = [];
                        for(var i = 2017;i <= today.getFullYear();i++){
                            all_years.push(i);
                        }
                        const all_orders = await orders.findAll({
                            where: { branch_id, status: { [Op.not]: "Cancelled" } },
                        });
                        // console.log(all_orders[0].dataValues)
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
                            Y.push(sales_revenue.toFixed(2));
                        }
                        res.json({
                            status: "success",
                            this_year: this_year,
                            prev_year: revenue_prev_year.toFixed(2),
                            this_month: revenue_this_month.toFixed(2),
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
                                branch_id,
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
                            Y.push(sales_revenue.toFixed(2));
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
                    if(req.query.month && req.query.year && req.query.year != "All"){
                        const monthStart = new Date(year,month,0);
                        const monthEnd = new Date(year,month,31);
                        const all_orders = await orders.findAll({
                            where: {
                                branch_id,
                                status: { [Op.not]: "Cancelled" },
                                createdAt: {
                                    [Op.between]: [monthStart, monthEnd]
                                }
                            }
                        });
                        let X = [];
                        let Y = [];
                        for(var i = 0;i < 31;i += 5){
                            let sales_revenue = 0;
                            for(var j = 0;j < all_orders.length;j++){
                                if(all_orders[j].createdAt.getDate() >= i && all_orders[j].createdAt.getDate() < i+5 ){
                                    sales_revenue += all_orders[i].paid_price;
                                }
                            }
                            X.push(i);
                            Y.push(sales_revenue.toFixed(2));
                        }
                        res.json({
                            status: "success",
                            this_year: this_year,
                            prev_year: revenue_prev_year.toFixed(2),
                            this_month: revenue_this_month.toFixed(2),
                            x: X,
                            y: Y
                        });
                    }
                    else{ 
                        const yearStart = new Date(today.getFullYear(), 0, 1);
                        const yearEnd = new Date(today.getFullYear(), 11, 31);
                        // return All records of particular year
                        const all_orders = await orders.findAll({
                            where: {
                                branch_id,
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
                            Y.push(sales_revenue.toFixed(2));
                        }
                        res.json({
                            status: "success",
                            this_year: this_year,
                            prev_year: revenue_prev_year.toFixed(2),
                            this_month: revenue_this_month.toFixed(2),
                            x: monthArray,
                            y: Y
                        });
                    }
                }

            }
            // Region Head and Super Admin / Owner Condition (uuid,all)
            else if (franchise_id && franchise_id != "All" && (!branch_id || branch_id == "All")) {
                    const all_branches = await branch.findAll({
                        where: {
                            franchise_id
                        }
                    });

                    const all_orders = await orders.findAll({
                        where: {
                            [Op.or]: [
                                { branch_id: all_branches.map((b) => b.branch_id) }
                            ],
                            status: { [Op.not]: "Cancelled" },
                        }
                    });
                    // For Bottom Three Fields
                    var revenue_this_month = 0;
                    var revenue_this_year = 0;
                    var revenue_prev_year = 0;
                    for (var j = 0; j < all_orders.length; j++) {
                        const order_month = new Date(all_orders[j].dataValues.createdAt);
                        const order_year = new Date(all_orders[j].dataValues.createdAt);
                        if (order_month.getMonth() == today.getMonth()) {
                            revenue_this_month += all_orders[j].dataValues.paid_price;
                        }
                        if (order_year.getFullYear() == today.getFullYear()) {
                            revenue_this_year += all_orders[j].dataValues.paid_price;
                        }
                        if (order_year.getFullYear() == (today.getFullYear() - 1)) {
                            revenue_prev_year += all_orders[j].dataValues.paid_price;
                        }
                    }
                    var diff = revenue_prev_year - revenue_this_year;
                    //console.log(diff);
                    var this_year = {}
                    var percentage;
                    if (revenue_prev_year != 0) {
                        percentage = ((Math.abs(diff) / revenue_prev_year) * 100).toFixed(2);
                    }
                    else {
                        percentage = 100;
                    }
                    this_year["revenue"] = revenue_this_year.toFixed(2);
                    if (diff >= 0)
                        this_year["percentage"] = `-${percentage}%`;
                    else
                        this_year["percentage"] = `+${percentage}%`;
                    // 3 hrs interval
                    if (filter_by == "today") {
                        const all_orders = await orders.findAll({
                            where: {
                                [Op.or]: [
                                    { branch_id: all_branches.map((b) => b.branch_id) }
                                ],
                                status: { [Op.not]: "Cancelled" },
                            }
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
                            Y.push(sales_revenue.toFixed(2));
                        }
                        // const avg_sales_per_day = (num_of_sales / 30).toFixed(2);
                        if (all_orders.length != 0) {
                            res.json({
                                status: "success",
                                num_of_sales: num_of_sales,
                                sales_revenue: sales_revenue,
                                this_year: this_year,
                                prev_year: revenue_prev_year.toFixed(2),
                                this_month: revenue_this_month.toFixed(2),
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
                            where: {
                                [Op.or]: [
                                    { branch_id: all_branches.map((b) => b.branch_id) }
                                ],
                                status: { [Op.not]: "Cancelled" },
                            }
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
                        }
                        // const avg_sales_per_day = (num_of_sales / 30).toFixed(2);
                        if (all_orders.length != 0) {
                            res.json({
                                status: "success",
                                num_of_sales: num_of_sales,
                                sales_revenue: sales_revenue,
                                this_year: this_year,
                                prev_year: revenue_prev_year.toFixed(2),
                                this_month: revenue_this_month.toFixed(2),
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
                    // Yearly
                    else if (filter_by == "yearly") {
                        // Send all year wise
                        if (year == "All" || !year) {
                            let all_years = [];
                            for(var i = 2017;i <= today.getFullYear();i++){
                                all_years.push(i);
                            }
                            const all_orders = await orders.findAll({
                                where: {
                                    [Op.or]: [
                                        { branch_id: all_branches.map((b) => b.branch_id) }
                                    ],
                                    status: { [Op.not]: "Cancelled" },
                                    // createdAt: {
                                    //     [Op.between]: [yearStart, yearEnd]
                                    // }
                                }
                            });
                            // console.log(all_orders[0].dataValues)
                            for (var i = 0; i < all_orders.length; i++) {
                                const y = new Date(all_orders[i].dataValues.createdAt).getFullYear();
                                // check if year exists in array
                                if (all_years.indexOf(y) == -1) {
                                    all_years.push(y);
                                }
                            }
                            console.log(all_years);
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
                                Y.push(sales_revenue.toFixed(2));
                            }
                            res.json({
                                status: "success",
                                this_year: this_year,
                                prev_year: revenue_prev_year.toFixed(2),
                                this_month: revenue_this_month.toFixed(2),
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
                                    [Op.or]: [
                                        { branch_id: all_branches.map((b) => b.branch_id) }
                                    ],
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
                                    const order_month = new Date(all_orders[j].dataValues.createdAt);
                                    if (order_month.getMonth() == i) {
                                        sales_revenue += all_orders[j].dataValues.paid_price;
                                    }
                                }
                                Y.push(sales_revenue.toFixed(2));
                            }
                            res.json({
                                status: "success",
                                this_year: this_year,
                                prev_year: revenue_prev_year.toFixed(2),
                                this_month: revenue_this_month.toFixed(2),
                                x: monthArray,
                                y: Y
                            });
                        }
                    }
                    // Monthly
                    else {
                         // Send data in 5 days interval of particular month 
                        if(req.query.month && req.query.year && req.query.year != "All"){
                            const monthStart = new Date(year,month,0);
                            const monthEnd = new Date(year,month,31);
                            const all_orders = await orders.findAll({
                                where: {
                                    [Op.or]: [
                                        { branch_id: all_branches.map((b) => b.branch_id) }
                                    ],
                                    status: { [Op.not]: "Cancelled" },
                                    createdAt: {
                                        [Op.between]: [monthStart, monthEnd]
                                    }
                                }
                            });
                            let X = [];
                            let Y = [];
                            for(var i = 0;i < 31;i += 5){
                                let sales_revenue = 0;
                                for(var j = 0;j < all_orders.length;j++){
                                    //console.log("Date ",all_orders[j].createdAt.getDate())
                                    if(all_orders[j].createdAt.getDate() >= i && all_orders[j].createdAt.getDate() < i+5 ){
                                        sales_revenue += all_orders[i].paid_price;
                                    }
                                }
                                X.push(i);
                                Y.push(sales_revenue.toFixed(2));
                            }
                            res.json({
                                status: "success",
                                this_year: this_year,
                                prev_year: revenue_prev_year.toFixed(2),
                                this_month: revenue_this_month.toFixed(2),
                                x: X,
                                y: Y
                            });
                        }
                        else{
                            const yearStart = new Date(today.getFullYear(), 0, 1);
                            const yearEnd = new Date(today.getFullYear(), 11, 31);
                            // return All records of particular year
                            const all_orders = await orders.findAll({
                                where: {
                                    [Op.or]: [
                                        { branch_id: all_branches.map((b) => b.branch_id) }
                                    ],
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
                                    const order_month = new Date(all_orders[j].dataValues.createdAt);
                                    if (order_month.getMonth() == i) {
                                        sales_revenue += all_orders[j].dataValues.paid_price;
                                    }
                                }
                                Y.push(sales_revenue.toFixed(2));
                            }
                            res.json({
                                status: "success",
                                this_year: this_year,
                                prev_year: revenue_prev_year.toFixed(2),
                                this_month: revenue_this_month.toFixed(2),
                                x: X,
                                y: Y
                            });
                        }
                    }
            }
            // Owner / Super Admin Condition (all,all)
            else {
                const all_orders = await orders.findAll({
                    where: {
                        status: { [Op.not]: "Cancelled" }
                    }
                });
                // For Bottom Three Fields
                var revenue_this_month = 0;
                var revenue_this_year = 0;
                var revenue_prev_year = 0;
                for (var j = 0; j < all_orders.length; j++) {
                    const order_month = new Date(all_orders[j].dataValues.createdAt);
                    const order_year = new Date(all_orders[j].dataValues.createdAt);
                    if (order_month.getMonth() == today.getMonth()) {
                        revenue_this_month += all_orders[j].dataValues.paid_price;
                    }
                    if (order_year.getFullYear() == today.getFullYear()) {
                        revenue_this_year += all_orders[j].dataValues.paid_price;
                    }
                    if (order_year.getFullYear() == (today.getFullYear() - 1)) {
                        revenue_prev_year += all_orders[j].dataValues.paid_price;
                    }
                }
                var diff = revenue_prev_year - revenue_this_year;
                //console.log(diff);
                var this_year = {}
                var percentage;
                if (revenue_prev_year != 0) {
                    percentage = ((Math.abs(diff) / revenue_prev_year) * 100).toFixed(2);
                }
                else {
                    percentage = 100;
                }
                this_year["revenue"] = revenue_this_year.toFixed(2);
                if (diff >= 0)
                    this_year["percentage"] = `-${percentage}%`;
                else
                    this_year["percentage"] = `+${percentage}%`;

                // 3 hrs interval
                if (filter_by == "today") {

                    const all_orders = await orders.findAll({
                        where: {
                            status: { [Op.not]: "Cancelled" }
                        }
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
                        Y.push(sales_revenue.toFixed(2));
                    }
                    // const avg_sales_per_day = (num_of_sales / 30).toFixed(2);
                    if (all_orders.length != 0) {
                        res.json({
                            status: "success",
                            num_of_sales: num_of_sales,
                            sales_revenue: sales_revenue,
                            this_year: this_year,
                            prev_year: revenue_prev_year.toFixed(2),
                            this_month: revenue_this_month.toFixed(2),
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
                else if (filter_by == "weekly") {
                    const all_orders = await orders.findAll({
                        where: {
                            status: { [Op.not]: "Cancelled" }
                        }
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
                    }
                    // const avg_sales_per_day = (num_of_sales / 30).toFixed(2);
                    if (all_orders.length != 0) {
                        res.json({
                            status: "success",
                            num_of_sales: num_of_sales,
                            sales_revenue: sales_revenue,
                            this_year: this_year,
                            prev_year: revenue_prev_year.toFixed(2),
                            this_month: revenue_this_month.toFixed(2),
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
                    if (year == "All" || !year) {
                        let all_years = [];
                        for(var i = 2017;i <= today.getFullYear();i++){
                            all_years.push(i);
                        }
                        const all_orders = await orders.findAll({
                            where: {
                                status: { [Op.not]: "Cancelled" },
                                // createdAt: {
                                //     [Op.between]: [yearStart, yearEnd]
                                // }
                            }
                        });
                        //console.log(all_orders[0].dataValues)
                        for (var i = 0; i < all_orders.length; i++) {
                            const y = new Date(all_orders[i].dataValues.createdAt).getFullYear();
                            // check if year exists in array
                            if (all_years.indexOf(y) == -1) {
                                all_years.push(y);
                            }
                        }
                        console.log(all_years);
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
                            Y.push(sales_revenue.toFixed(2));
                        }
                        res.json({
                            status: "success",
                            this_year: this_year,
                            prev_year: revenue_prev_year.toFixed(2),
                            this_month: revenue_this_month.toFixed(2),
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
                                const order_month = new Date(all_orders[j].dataValues.createdAt);
                                if (order_month.getMonth() == i) {
                                    sales_revenue += all_orders[j].dataValues.paid_price;
                                }
                            }
                            Y.push(sales_revenue.toFixed(2));
                        }
                        res.json({
                            status: "success",
                            this_year: this_year,
                            prev_year: revenue_prev_year.toFixed(2),
                            this_month: revenue_this_month.toFixed(2),
                            x: monthArray,
                            y: Y
                        });
                    }
                }
                // Monthly
                else {
                     // Send data in 5 days interval of particular month 
                     if(req.query.month && req.query.year && req.query.year != "All"){
                        const monthStart = new Date(year,month,0);
                        const monthEnd = new Date(year,month,31);
                        const all_orders = await orders.findAll({
                            where: {
                                status: { [Op.not]: "Cancelled" },
                                createdAt: {
                                    [Op.between]: [monthStart, monthEnd]
                                }
                            }
                        });
                        let X = [];
                        let Y = [];
                        for(var i = 0;i < 31;i += 5){
                            let sales_revenue = 0;
                            for(var j = 0;j < all_orders.length;j++){
                                console.log("Date ",all_orders[j].createdAt.getDate())
                                if(all_orders[j].createdAt.getDate() >= i && all_orders[j].createdAt.getDate() < i+5 ){
                                    // console.log(all_orders[j].paid_price)
                                    sales_revenue += all_orders[j].paid_price;
                                }
                            }
                            X.push(i);
                            Y.push(sales_revenue.toFixed(2));
                        }
                        res.json({
                            status: "success",
                            this_year: this_year,
                            prev_year: revenue_prev_year.toFixed(2),
                            this_month: revenue_this_month.toFixed(2),
                            x: X,
                            y: Y
                        });
                    }
                    else{
                        const yearStart = new Date(today.getFullYear(), 0, 1);
                        const yearEnd = new Date(today.getFullYear(), 11, 31);
                        // return All records of particular year
                        const all_orders = await orders.findAll({
                            where: {
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
                                const order_month = new Date(all_orders[j].dataValues.createdAt);
                                if (order_month.getMonth() == i) {
                                    sales_revenue += all_orders[j].dataValues.paid_price;
                                }
                            }
                            Y.push(sales_revenue.toFixed(2));
                        }
                        res.json({
                            status: "success",
                            this_year: this_year,
                            prev_year: revenue_prev_year.toFixed(2),
                            this_month: revenue_this_month.toFixed(2),
                            x: monthArray,
                            y: Y
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

    async sales_analytics_pie(req, res) {
        try {
            const sales_revenue = await orders.sum("paid_price",{
                where:{
                    status:{
                        [Op.not]:"Cancelled"
                    }
                }
            });

            const all_franchises = await franchise.findAll();
            var revenue = 0;
            let best_franchise;
            for (var i = 0; i < all_franchises.length; i++) {
                const all_branches = await branch.findAll({
                    where: { franchise_id: all_franchises[i].dataValues.franchise_id }
                });
                const total_revenue = await orders.sum("paid_price", {
                    where: {
                        status: { [Op.not]: "Cancelled" },
                        branch_id: {
                            [Op.or]: all_branches.map(b => b.dataValues.branch_id)
                        }
                    }
                });
                if (total_revenue > revenue) {
                    revenue = total_revenue;
                    best_franchise = all_franchises[i].dataValues.franchise_id;
                }
            }
            const best_franchise_branches = await branch.findAll({
                where: { franchise_id: best_franchise }
            });
            let sales_analytics = [];
            for (var i = 0; i < best_franchise_branches.length; i++) {
                const branch_sales = await orders.sum("paid_price", {
                    where: {
                        status: { [Op.not]: "Cancelled" },
                        branch_id: best_franchise_branches[i].dataValues.branch_id
                    }
                });
                const branch_name = best_franchise_branches[i].dataValues.branch_name;
                const obj = {};
                obj[branch_name] = ((branch_sales / sales_revenue) * 100).toFixed(2) + "%";
                sales_analytics.push(obj);
            }
            res.json({
                status: "success",
                sales_analytics:sales_analytics
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
}

module.exports = new adminDashboardHomeController();