const sequelize = require("sequelize");
const Op = sequelize.Op;
const { employee, customer, orders, order_items, categories, product, product_list,
    franchise, branch, category_list, add_ons, add_on_option, per_product_add_ons, order_history,
    order_items_history, employee_roles, coupons, customer_roles, emp_cashier, customer_group_members, contact_us, customer_ordered_product
} = require("../models");
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const req = require("express/lib/request");
const fs = require('fs')
const directory_forjson = path.join(__dirname, '../data');
console.log("directory_forjso", directory_forjson)
class addproductController {

    // Register New Customer
    // addpcustomerbulk
    async addcustomerbulk(req, res) {
        try {
            for (var l = 216; l < 217; l++) {
                const dataBuffer = fs.readFileSync(`${directory_forjson}\\customer\\${l}.json`)
                const dataJSON = dataBuffer.toString()
                var data = JSON.parse(dataJSON)
                // console.log("data", data)
                var obj = [];
                // const customer_roles = await customer_roles.findAll({
                // })
                for (var i = 0; i < 110; i++) {
                    var memb_upg_amount;
                    var memb_upg_categ;
                    var memb_days_left;
                    var customer_type;
                    var memb_reduce_amount;
                    var custtype = data[i].Group.toLowerCase();
                    if (data[i].Group == "Platinum" || (custtype == "platinum")) {
                        memb_upg_amount = null;
                        memb_upg_categ = null;
                        customer_type = "Platinum";
                        memb_days_left = 120;
                        memb_reduce_amount = 10000;
                    } else if (data[i].Group == "Gold" || (custtype == "gold")) {
                        memb_upg_amount = 10000;
                        memb_upg_categ = "Platinum";
                        customer_type = "Gold";
                        memb_days_left = 60;
                        memb_reduce_amount = 5000;
                    } else if (data[i].Group == "Silver" || (custtype == "silver")) {
                        memb_upg_amount = 5000;
                        memb_upg_categ = "Gold";
                        customer_type = "Silver";
                        memb_days_left = 30;
                        memb_reduce_amount = 2500;
                    } else {
                        memb_upg_amount = 5000;
                        memb_upg_categ = "Silver";
                        customer_type = "General";
                        memb_days_left = 30;
                        memb_reduce_amount = 0;
                    }
                    // var first_name = 
                    const myArray = data[i].Name.split(" ");
                    var first = "";
                    first = myArray.splice(0, 1);
                    var last_name = "";
                    console.log("myArray", myArray)
                    // console.log("first", first)
                    if (myArray.length > 0) {
                        last_name = myArray.join(' ');
                    }
                    console.log("last_name", last_name)
                    var start_date = new Date().toISOString().slice(0, 10);
                    // const customer_role = await customer_roles.findAll({
                    //     offset: 1,
                    //     order: [
                    //         ["min_purchase", "ASC"]
                    //     ]
                    // })
                    // console.log(customer_role)
                    var createdAt = new Date(data[i]["Customer Since"]);
                    console.log("createdAt", createdAt)
                    // var gender = "male";
                    // req.body.memb_upg_amount = customer_role.min_purchase;
                    // req.body.memb_upg_categ = customer_role.customer_type;
                    // req.body.memb_days_left = customer_role.total_days;
                    // var shipping_address = {}
                    console.log("first_name", first[0])
                    obj.push({
                        first_name: first[0],
                        last_name,
                        email: data[i].Email,
                        mobile_no: data[i].Telephone,
                        branch: "Heebee Coffee",
                        branch_id: "3e4dd110-94ba-4146-893f-6e545258b0e7",
                        memb_upg_amount,
                        memb_upg_categ,
                        memb_days_left,
                        customer_type,
                        memb_reduce_amount,
                        shipping_address: {
                            "address": "",
                            "pincode": data[i].ZIP
                        },
                        billing_address: {
                            "address": "",
                            "pincode": data[i].ZIP
                        },
                        start_date,
                        ID: data[i].ID,
                        createdAt

                    })
                    // console.log(" new Date()", new Date("Oct 13, 2018 11:54:03 AM"))
                    // 2018-10-13T06:24:03.000Z
                    // 2022-07-14T10:31:54.541Z
                    // res.json({ "status": "success", "customer": customer_details });
                }
                const customer_details = await customer.bulkCreate(obj);
            }
            // if (customer_details) {
            res.json({
                status: "success",
                data: obj
            });
            // }
        }
        catch (e) {
            console.log(e);
            res.status(500).json({
                status: "failure",
                msg: e
            });
        }
    }


    // addorderbulk
    async addorderbulk(req, res) {
        try {
            for (var l = 706; l < 998; l++) {
                const dataBuffer = fs.readFileSync(`${directory_forjson}\\orders\\${l}.json`)
                const dataJSON = dataBuffer.toString()
                var data = JSON.parse(dataJSON)
                var orderd_items = [];
                var order = []
                console.log("data", data.length, "l", l, "order", order, "orderd_items", orderd_items)
                // const customer_roles = await customer_roles.findAll({
                // })
                for (var i = 0; i < 200; i++) {
                    console.log("l", l, "i", i)
                    if ((data[i].Status) == "Complete") {
                        var id_cust = data[i].details.accountDetails.customerId;
                        var customer_data = await customer.findOne({
                            where: {
                                ID: id_cust
                            },
                            raw: true
                        })
                        console.log("customer_data", customer_data)
                        if (customer_data) {
                            console.log("i", i);
                            var customer_no = customer_data.mobile_no;
                            var branch_name;
                            var branch_id;
                            if (data[i]["Order #"].includes("Sarabha")) {
                                branch_id = "3e4dd110-94ba-4146-893f-6e545258b0e7";
                                var branch_name = "Sarabha Nagar";
                            } else if (data[i]["Order #"].includes("Ghumar")) {
                                branch_id = "f048edca-f663-4df4-bd54-ae5563d9fc6e";
                                branch_name = "Ghumar Mandi";
                            } else {
                                branch_id = "3e4dd110-94ba-4146-893f-6e545258b0e7";
                                var branch_name = "Sarabha Nagar";
                            }
                            var status = data[i].Status;
                            var paid;
                            console.log("status", status)
                            // orders_status = "Completed"
                            if (status == "Canceled") {
                                status = "Cancelled";
                                paid = false;
                            } else if (status == "Complete") {
                                status = "Completed";
                                paid = true;
                            } else if (status == "Pending") {
                                status = "Preparing";
                                paid = true;
                            } else if (status == "Accepted") {
                                status = "Completed";
                                paid = true;
                            } else {
                                status = "Completed";
                                paid = true;
                            }
                            var order_type;
                            if (data[i]["Order Type"] = "Pick-up") {
                                order_type = "Take Away"
                            } else {
                                order_type = "Dine In"
                            }
                            // completed time\
                            var completed_time;
                            console.log("data", (data[i].details.orderDetails.OrderDelivery))
                            var createdAt = new Date(data[i]["Purchased On"]);
                            if (((data[i].details.orderDetails.OrderDelivery) != "") && ((data[i]["Purchased On"]) != "")) {
                                const d1 = new Date(data[i]["Purchased On"]);
                                const d2 = new Date(data[i].details.orderDetails.OrderDelivery);
                                completed_time = await msToTime((d2 - d1));
                                console.log("completed_time", completed_time)
                                async function msToTime(ms) {
                                    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
                                    const daysms = ms % (24 * 60 * 60 * 1000);
                                    const hours = Math.floor(daysms / (60 * 60 * 1000));
                                    const hoursms = ms % (60 * 60 * 1000);
                                    const minutes = Math.floor(hoursms / (60 * 1000));
                                    const minutesms = ms % (60 * 1000);
                                    const sec = Math.floor(minutesms / 1000);
                                    return days + "d" + hours + "h" + minutes + "m" + sec + "s";
                                }
                            }

                            // 
                            // 
                            var total_paid_price = 0;
                            var total_sub_total = 0;
                            var total_tax = 0;
                            var total_discount = 0;
                            var createdAt = new Date(data[i]["Purchased On"]);
                            let year = createdAt.getFullYear();
                            console.log("createdAt", createdAt)
                            // created at and order id
                            var old_order_id = data[i]["Order #"];
                            const recent_id = `${parseInt(data[i].order_id)}`;
                            console.log("id ", recent_id);
                            const places = 8 - recent_id.length;
                            console.log("places ", places);
                            var padZeros = ""
                            if (places > 0) {
                                for (var k = 0; k < places; k++) {
                                    padZeros += "0";
                                }
                            }  // Padding zeros
                            var order_id = `POS${year}${padZeros}${recent_id}`;
                            console.log("order_id", order_id);
                            var SubTotal = 0;
                            var TaxAmount = 0;
                            var total_items = 0;
                            var DiscountAmount = 0;
                            console.log("data[i].order_id", data[i].order_id)
                            for (let [key, value] of Object.entries(data[i].details.itemsDetails)) {
                                if (value.DiscountAmount) {
                                    console.log("value.DiscountAmount", value.DiscountAmount)
                                    console.log(key, parseInt((value.DiscountAmount).replace('₹', '')));
                                    console.log(key, parseInt((value.SubTotal).replace('₹', '')));
                                    console.log(key, parseInt((value.TaxAmount).replace('₹', '')));
                                    // console.log(key, parseInt((value.TaxAmount).replace('₹', '')));
                                    var name = '%' + value.Product.item + '%';
                                    var sku = value.Product.sku;
                                    var product_list_data = await product_list.findOne({
                                        where: {
                                            product_name: {
                                                [Op.like]: name
                                            }
                                        },
                                        // raw:true,
                                    })
                                    var product_id;
                                    var product_name;
                                    var product_type;
                                    var food_type;
                                    var prepare_time;
                                    if (product_list_data) {
                                        const customer_ordered_product_datafind = await customer_ordered_product.findOne({
                                            where: {
                                                customer_id: customer_data.customer_id,
                                                product_list_id: product_list_data.product_list_id
                                            }
                                        })
                                        if (customer_ordered_product_datafind) {
                                            if (value.Qty.ordered) {
                                                customer_ordered_product_datafind.order_count = parseInt(customer_ordered_product_datafind.order_count) + parseInt(value.Qty.ordered);
                                                await customer_ordered_product_datafind.save();
                                            } else {
                                                customer_ordered_product_datafind.order_count = parseInt(customer_ordered_product_datafind.order_count) + 1;
                                                await customer_ordered_product_datafind.save();
                                            }
                                        } else {
                                            if (value.Qty.ordered) {
                                                const customer_ordered_product_data = await customer_ordered_product.create({
                                                    customer_id: customer_data.customer_id,
                                                    product_list_id: product_list_data.product_list_id,
                                                    order_count: parseInt(value.Qty.ordered)
                                                })
                                            } else {
                                                const customer_ordered_product_data = await customer_ordered_product.create({
                                                    customer_id: customer_data.customer_id,
                                                    product_list_id: product_list_data.product_list_id,
                                                    order_count: 1
                                                })
                                            }
                                        }
                                        var inc = await product.findOne({
                                            where: {
                                                product_list_id: product_list_data.product_list_id,
                                                branch_id: branch_id

                                            },
                                            // raw:true,
                                        });
                                        if (inc) {
                                            product_id = inc.product_id;
                                            product_name = product_list_data.product_name;
                                            product_type = product_list_data.product_type;
                                            food_type = product_list_data.food_type;
                                            prepare_time = product_list_data.prepare_time
                                            if (sku == "" || sku == null) {
                                                sku = product_list_data.sku
                                            }
                                            console.log("product_list_data", product_list_data)
                                        } else {
                                            product_id = product_list_data.product_list_id;
                                            product_name = product_list_data.product_name;
                                            product_type = product_list_data.product_type;
                                            food_type = product_list_data.food_type;
                                            prepare_time = product_list_data.prepare_time
                                            if (sku == "" || sku == null) {
                                                sku = product_list_data.sku
                                            }
                                            console.log("product_list_data", product_list_data)
                                        }

                                    } else {
                                        name = '%' + (value.Product.item.split(" ")[0]) + '%'
                                        var product_list_data = await product_list.findOne({
                                            where: {
                                                product_name: {
                                                    [Op.iLike]: name
                                                }
                                            }
                                        })
                                        if (product_list_data) {
                                            const customer_ordered_product_datafind = await customer_ordered_product.findOne({
                                                where: {
                                                    customer_id: customer_data.customer_id,
                                                    product_list_id: product_list_data.product_list_id
                                                }
                                            })
                                            if (customer_ordered_product_datafind) {
                                                if (value.Qty.ordered) {
                                                    customer_ordered_product_datafind.order_count = parseInt(customer_ordered_product_datafind.order_count) + parseInt(value.Qty.ordered);
                                                    await customer_ordered_product_datafind.save();
                                                } else {
                                                    customer_ordered_product_datafind.order_count = parseInt(customer_ordered_product_datafind.order_count) + 1;
                                                    await customer_ordered_product_datafind.save();
                                                }
                                            } else {
                                                if (value.Qty.ordered) {
                                                    const customer_ordered_product_data = await customer_ordered_product.create({
                                                        customer_id: customer_data.customer_id,
                                                        product_list_id: product_list_data.product_list_id,
                                                        order_count: parseInt(value.Qty.ordered)
                                                    })
                                                } else {
                                                    const customer_ordered_product_data = await customer_ordered_product.create({
                                                        customer_id: customer_data.customer_id,
                                                        product_list_id: product_list_data.product_list_id,
                                                        order_count: 1
                                                    })
                                                }
                                            }
                                            
                                            var inc = await product.findOne({
                                                where: {
                                                    product_list_id: product_list_data.product_list_id,
                                                    branch_id: branch_id

                                                },
                                                // raw:true,
                                            });
                                            if (inc) {
                                                product_id = inc.product_id;
                                                product_name = product_list_data.product_name;
                                                product_type = product_list_data.product_type;
                                                food_type = product_list_data.food_type;
                                                prepare_time = product_list_data.prepare_time
                                                if (sku == "" || sku == null) {
                                                    sku = product_list_data.sku
                                                }
                                                console.log("product_list_data", product_list_data)
                                            } else {
                                                product_id = product_list_data.product_list_id;
                                                product_name = product_list_data.product_name;
                                                product_type = product_list_data.product_type;
                                                food_type = product_list_data.food_type;
                                                prepare_time = product_list_data.prepare_time
                                                if (sku == "" || sku == null) {
                                                    sku = product_list_data.sku
                                                }
                                                console.log("product_list_data", product_list_data)
                                            }
                                        } else {
                                            product_id = "1aeee5a4-5e12-4c68-8452-eaca5ea1acf2";
                                            product_name = "Unknwon";
                                            product_type = "Unknwon";
                                            food_type = "Unknwon";
                                            prepare_time = "Unknwon"
                                            if (sku == "" || sku == null) {
                                                sku = "Unknwon"
                                            }
                                            console.log("product_list_data", product_list_data)
                                        }

                                    }
                                    SubTotal = parseInt((value.SubTotal).replace('₹', ''));
                                    TaxAmount = parseInt((value.TaxAmount).replace('₹', ''));
                                    DiscountAmount = parseInt((value.DiscountAmount).replace('₹', ''));
                                    total_paid_price += ((SubTotal) + (TaxAmount) - (DiscountAmount))
                                    total_sub_total += ((SubTotal))
                                    total_tax += ((TaxAmount))
                                    total_discount += ((DiscountAmount))
                                    if (value.Qty.ordered) {
                                        total_items += parseInt(value.Qty.ordered)
                                    } else {
                                        total_items += 1
                                    }
                                    console.log("SubTotal", SubTotal)
                                    console.log("TaxAmount", TaxAmount)
                                    console.log("DiscountAmount", DiscountAmount)
                                    // const create_order_items = await order_items.create({
                                    //     order_id,
                                    //     "quantity": (parseInt(value.Qty.ordered)),
                                    //     "price": SubTotal,
                                    //     "total_price": ((SubTotal) + (TaxAmount) - (DiscountAmount)),
                                    //     "discount": DiscountAmount,
                                    //     createdAt,
                                    //     product_list_data,
                                    //     product_id,
                                    //     sku,
                                    //     product_name,
                                    //     old_order_id,
                                    //     delivery_status: true,
                                    //     status: "Completed",
                                    //     product_type,
                                    //     food_type,
                                    //     prepare_time,
                                    //     quantity_completed: (parseInt(value.Qty.ordered)),
                                    //     prepared_by: "339841eb-f585-4aae-a2d1-bccd07135961"
                                    // });
                                    var latestqt = 1;
                                    if (value.Qty.ordered) {
                                        latestqt += parseInt(value.Qty.ordered)
                                    }
                                    orderd_items.push({
                                        order_id,
                                        "quantity": latestqt,
                                        "price": SubTotal,
                                        "total_price": ((SubTotal) + (TaxAmount) - (DiscountAmount)),
                                        "discount": DiscountAmount,
                                        createdAt,
                                        product_id,
                                        sku,
                                        product_name,
                                        old_order_id,
                                        delivery_status: true,
                                        status: "Completed",
                                        product_type,
                                        food_type,
                                        prepare_time,
                                        quantity_completed: latestqt,
                                        prepared_by: "339841eb-f585-4aae-a2d1-bccd07135961"
                                    })
                                }
                            }
                            order.push({
                                order_id,
                                "sub_total": total_sub_total,
                                "tax": total_tax,
                                total_items,
                                "discount": total_discount,
                                "paid_price": total_paid_price,
                                "sgst": (total_tax / 2),
                                "cgst": (total_tax / 2),
                                customer_no,
                                "employee_id": "339841eb-f585-4aae-a2d1-bccd07135961",
                                branch_name,
                                paid,
                                branch_id,
                                status,
                                order_from: "WebPos",
                                order_type,
                                "payment_method": "cash",
                                "received": total_paid_price,
                                "change": 0,
                                "cash_amount": total_paid_price,
                                "card_amount": 0,
                                completed_time,
                                old_order_id,
                                createdAt
                            })
                            // const newOrder = await orders.create({
                            //     order_id,
                            //     customer_no,
                            //     employee_id,
                            //     branch_id,
                            //     branch_name,
                            //     total_items,
                            //     paid_price,
                            //     sub_total,
                            //     tax,
                            //     discount,
                            //     applied_coupons,
                            //     comment,
                            //     status,
                            //     paid,
                            //     payment_method,
                            //     payment_id,
                            //     account_id,
                            //     received,
                            //     change,
                            //     order_type,
                            //     address,
                            //     ord_rec_time,
                            //     order_from: "WebPos",
                            //     cash_amount,
                            //     card_amount,
                            //     sgst,
                            //     cgst,
                            //     membership_discount,
                            //     bypass_otp,
                            //     delivery_charges
                            // });
                        }

                    }
                }
                console.log("current file no l", l)
                const create_order = await orders.bulkCreate(order);
                console.log("current file no l", l)
                const create_order_items = await order_items.bulkCreate(orderd_items);
                console.log("current file no l", l)

                // res.json({
                //     status: "success",
                //     // create_order,
                //     // create_order_items,
                //     order,
                //     orderd_items
                // });
            }
        }
        catch (e) {
            console.log(e)
            console.log(e);
            res.status(500).json({
                status: "failure",
                msg: e
            });
        }
    }
    // /


    async delorderbulk(req, res) {
        try {
            for (var l = 94; l < 95; l++) {
                const dataBuffer = fs.readFileSync(`${directory_forjson}\\orders\\${l}.json`)
                const dataJSON = dataBuffer.toString()
                var data = JSON.parse(dataJSON)
                var orderd_items = [];
                var order = []
                console.log("data", data.length, "l", l, "order", order, "orderd_items", orderd_items)
                // const customer_roles = await customer_roles.findAll({
                // })
                for (var i = 0; i < 200; i++) {
                    var createdAt = new Date(data[i]["Purchased On"]);
                    let year = createdAt.getFullYear();
                    var old_order_id = data[i]["Order #"];
                    const recent_id = `${parseInt(data[i].order_id)}`;
                    console.log("id ", recent_id);
                    const places = 8 - recent_id.length;
                    console.log("places ", places);
                    var padZeros = ""
                    if (places > 0) {
                        for (var k = 0; k < places; k++) {
                            padZeros += "0";
                        }
                    }  // Padding zeros
                    var order_id = `POS${year}${padZeros}${recent_id}`;
                    console.log("order_id", order_id);
                    const deleted_order_items = await order_items.destroy({
                        where: {
                            order_id
                        }
                    });
                    const deleted_order = await orders.destroy({
                        where: {
                            order_id
                        }
                    });
                }
                res.json({
                    status: "success",
                    // create_order,
                    // create_order_items,
                    // order,
                    // orderd_items
                });
            }
        }
        catch (e) {
            console.log(e)
            console.log(e);
            res.status(500).json({
                status: "failure",
                msg: e
            });
        }
    }
    // 



    async addproductbulk(req, res) {
        try {
            const dataBuffer = fs.readFileSync(`${directory_forjson}\\customer\\11.json`)
            const dataJSON = dataBuffer.toString()
            var data = JSON.parse(dataJSON)
            // console.log("data", data)
            var obj = [];
            for (var i = 0; i < data.length; i++) {
                var status;
                if (data[i].Status == "Enabled") {
                    status = true
                } else {
                    status = false
                }
                var prod = data[i].Name.toLowerCase();
                var food_type;
                if (data[i].product_type = "others") {
                    food_type = "Veg"
                } else if (data[i].product_type = "nonveg") {
                    food_type = "Non-Veg"
                } else if (prod.includes("chick") || prod.includes("fish") || prod.includes("non veg")) {
                    food_type = "Non-Veg"
                } else {
                    food_type = "Veg"
                }
                var product_type;
                product_type = "Barista"
                // if (prod.includes("coffee") || prod.includes("cake") || prod.includes("chin") || prod.includes("doughnuts") || prod.includes("americano")) {

                // } else {
                //     product_type = "Kitchen"
                // }
                obj.push({
                    product_name: data[i].Name,
                    sku: data[i].SKU,
                    "description": data[i].Name,
                    price: parseInt(data[i].Price),
                    prepare_time: "10m",
                    product_type: product_type,
                    food_type: food_type,
                    "card_img": "https://heebeetestapi.quadbtech.com/a0577fff105b76043bd3eb624f5a3725pizza.jpg",
                    status: status,
                    ID: data[i].ID
                });

                var add_product_list = await product_list.create({
                    product_name: data[i].Name,
                    sku: data[i].SKU,
                    "description": data[i].Name,
                    price: parseInt(data[i].Price),
                    prepare_time: "10m",
                    product_type: product_type,
                    food_type: food_type,
                    "card_img": "https://heebeetestapi.quadbtech.com/a0577fff105b76043bd3eb624f5a3725pizza.jpg",
                    status: status,
                    ID: data[i].ID
                });
                console.log("data[i]", data[i])
                for (var j = 0; j < data[i].details.length; j++) {
                    console.log("data[i]2", data[i])
                    var title_addon = ""
                    if (data[i].details[j].title) {
                        title_addon = data[i].details[j].title;
                    }
                    var new_addon = await add_ons.create({
                        "title": title_addon,
                        "add_on_type": data[i].details[j].type,
                        "order": parseInt(data[i].details[j].sort_order)
                    })
                    var data1 = await per_product_add_ons.create({
                        product_list_id: add_product_list.product_list_id,
                        add_ons_id: new_addon.add_ons_id
                    })
                    var add_ons_id = new_addon.add_ons_id;
                    if (data[i].details[j].optionValues) {
                        for (var k = 0; k < data[i].details[j].optionValues.length; k++) {
                            var sku_option = "";
                            var title_option = "";
                            if (data[i].details[j].optionValues[k].sku) {
                                sku_option = data[i].details[j].optionValues[k].sku;
                            }
                            if (data[i].details[j].optionValues[k].title) {
                                title_option = data[i].details[j].optionValues[k].title;
                            }
                            var new_addon = await add_on_option.create({
                                "add_ons_id": add_ons_id,
                                "title": title_option,
                                "price": parseInt(data[i].details[j].optionValues[k].price),
                                "sku": sku_option,
                                "order": parseInt(data[i].details[j].optionValues[k].sort_order)
                            });
                        }
                    }
                }
            }
            // if (result) {
            res.json({
                status: "success",
                data: obj
            });
            // }
        }
        catch (e) {
            console.log(e);
            res.status(500).json({
                status: "failure",
                msg: e
            });
        }
    }
    // getcustomerbulk
    async getcustomerbulk(req, res) {
        try {
            const dataBuffer = fs.readFileSync(`${directory_forjson}\\customer\\216.json`)
            const dataJSON = dataBuffer.toString()
            var data = JSON.parse(dataJSON)
            // console.log("data", data)

            // if (customer_details) {
            res.json({
                status: "success",
                data: data
            });
            // }
        }
        catch (e) {
            console.log(e);
            res.status(500).json({
                status: "failure",
                msg: e
            });
        }
    }
    // getproductbulk
    async getproductbulk(req, res) {
        try {
            const dataBuffer = fs.readFileSync(`${directory_forjson}\\Product2.json`)
            const dataJSON = dataBuffer.toString()
            var data = JSON.parse(dataJSON)
            // console.log("data", data)
            var obj = [];
            for (var i = 0; i < data.length; i++) {
                var status;
                if (data[i].Status == "Enabled") {
                    status = true
                } else {
                    status = false
                }
                var prod = data[i].Name.toLowerCase();
                var food_type;
                if (data[i].product_type = "others") {
                    food_type = "Veg"
                } else if (data[i].product_type = "nonveg") {
                    food_type = "Non-Veg"
                } else if (prod.includes("chick") || prod.includes("fish") || prod.includes("non veg")) {
                    food_type = "Non-Veg"
                } else {
                    food_type = "Veg"
                }
                var product_type;
                product_type = "Barista"
                // if (prod.includes("coffee") || prod.includes("cake") || prod.includes("chin")) {
                //     product_type = "Barista"
                // } else {
                //     product_type = "Kitchen"
                // }
                obj.push({
                    product_name: data[i].Name,
                    sku: data[i].SKU,
                    "description": data[i].Name,
                    price: parseInt(data[i].Price),
                    prepare_time: "10m",
                    product_type: product_type,
                    food_type: food_type,
                    "card_img": "https://heebeetestapi.quadbtech.com/a0577fff105b76043bd3eb624f5a3725pizza.jpg",
                    status: status,
                    ID: data[i].ID
                });
            }
            // if (result) {
            res.json({
                status: "success",
                data: obj,
            });
            // }
        }
        catch (e) {
            console.log(e);
            res.status(500).json({
                status: "failure",
                msg: e
            });
        }
    }

    // addbranch
    // ["633c4cd5-31e2-417e-933a-8ca7b0391b48", "6c24a9dc-22a8-428c-b082-68981efe57e2", "60e5ee12-220f-4656-af9f-f37219fbb966", "8337f5d1-cfcc-4413-9214-c8629ef79aa9", "63c1dd5b-1a4d-4ec7-9629-2b3bb5f42a27", "468dd99d-49ba-46f8-a56e-380aa0c46d4a", "934b8b95-8b02-433e-9d5c-4d7f6486d9df", "98e28f87-abb4-434d-ac5c-952642badd11", "4c3506f4-9680-4c50-a400-081252107cfb", "e4c046dd-8e7d-4d5b-9656-8af2ce5db37d", "95c200bb-33ea-436e-b4e9-72b76be127db", "c96e0164-517f-43e4-a78d-798224ebdafa", "f9b9d662-6083-41e9-889b-c34b10fa8f97", "8af00725-74c5-42c0-94cc-7a9a7c159f18"]
    async addbranch(req, res) {
        try {
            var data = ["918de671-8bad-4c7b-a2da-aae10ba2881b", "59111c5b-ea7b-4f8b-9a94-55c6e6903f01", "8f257133-a064-41c8-980e-d29257543016", "6e7d6195-ad61-4397-9f2e-ed59db2a0599", "60e5ee12-220f-4656-af9f-f37219fbb966", "8337f5d1-cfcc-4413-9214-c8629ef79aa9", "2247dba7-e83e-4166-8901-c7cb2d1d43cb", "779808a9-8996-4bbd-bce2-4814ccc40162", "a28101c4-64e3-41dc-a7e7-6a509ddae81d", "4405ee0c-2240-444c-898c-42dd8609d91d", "cebfc4d0-07d2-4b1d-81e1-a65857667fa4", "34a1424c-87a3-4b50-906b-5c12bf4d136d", "fd6db11a-04b0-41ae-b893-b3f5fe766a0a", "91eea18e-b524-431a-b6b4-aba1231e37bc", "13abaa42-9d8c-4ebb-a3fd-6078b56277fe", "68333ae2-d809-4a29-ad42-77441fd87274", "779fc415-028b-44df-b7b1-0b0ec32b217e", "a6387cad-2040-4d81-9933-f36c25e33293", "e75387b1-be90-4a77-b162-7d4f03459bbc", "c8e9ad05-952b-453b-9e8b-6b02acd429a2"];
            var obj = [];
            // category_id = f9d69d8f-ac52-4228-94c1-12ac9264f86d
            // branch id = 3e4dd110-94ba-4146-893f-6e545258b0e7
            for (var i = 0; i < data.length; i++) {
                var productlist = await product_list.findOne({
                    where: {
                        product_list_id: data[i]
                    }
                })
                console.log(productlist)
                obj.push({
                    product_list_id: productlist.product_list_id,
                    branch_id: "3e4dd110-94ba-4146-893f-6e545258b0e7",
                    category_id: "f9d69d8f-ac52-4228-94c1-12ac9264f86d",
                    status: true,
                    price: productlist.price,
                    items_available: 600
                });
                var cat = await product.create({
                    product_list_id: productlist.product_list_id,
                    branch_id: "3e4dd110-94ba-4146-893f-6e545258b0e7",
                    category_id: "f9d69d8f-ac52-4228-94c1-12ac9264f86d",
                    status: true,
                    price: productlist.price,
                    items_available: 600
                });
                console.log("cat", cat)
            }
            // if (data) {
            res.json({
                status: "success",
                obj

            });
            // }

        }
        catch (e) {
            console.log(e);
            res.status(500).json({
                status: "failure",
                msg: e
            });
        }
    }


}


module.exports = new addproductController();





