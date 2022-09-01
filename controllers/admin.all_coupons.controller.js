const { condition } = require("sequelize");
const sequelize = require("sequelize");
const Op = sequelize.Op;

const { customer, employee, coupons, branch, customer_group, customer_roles
} = require("../models");

class adminAllCouponsController {

    async fetch_all_coupons(req, res) {
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
            const data = await coupons.findAll({
                offset: pgnum, limit: per_page
            });
            const total_coupons_count = await coupons.count();
            if (data.length != 0) {
                res.json({
                    status: "success",
                    total_coupons_count,
                    data
                });
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
            res.json({
                status: "failure",
                msg: err
            });
        }
    }

    // fetch_sngle_coupons
    async fetch_sngle_coupons(req, res) {
        try {
            
            const data = await coupons.findOne({
                where:{
                    coupon_id: req.query.coupon_id
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
                    msg: "No data found!"
                })
            }
        }
        catch (err) {
            console.log(err);
            res.json({
                status: "failure",
                msg: err
            });
        }
    }


    async fetch_all_branch(req, res) {
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
            const data = await branch.findAll({
                offset: pgnum, limit: per_page
            });
            const total_branch = await branch.count();
            if (data.length != 0) {
                res.json({
                    status: "success",
                    total_branch,
                    data
                });
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
            res.json({
                status: "failure",
                msg: err
            });
        }
    }

    async search_customers(req, res) {
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

            if (req.query.search) {
                var search = req.query.search
                const data = await customer.findAll({
                    offset: pgnum, limit: per_page,
                    where: {
                        [Op.or]: [{
                            mobile_no: {
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            first_name: {
                                [Op.iLike]: `%${search}%`
                            }
                        }
                        ]
                    }
                });

                const total_cust_count = await customer.count({
                    where: {
                        [Op.or]: [{
                            mobile_no: {
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            first_name: {
                                [Op.iLike]: `%${search}%`
                            }
                        }
                        ]
                    }
                });

                if (data) {
                    res.json({
                        status: "success",
                        total_cust_count,
                        data
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

    async search_coupons(req, res) {
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
            var condition = {}
            if (req.query.coupon_code) {
                var coupon_code_search = req.query.coupon_code
                const coupon_code_seperatedQuery = coupon_code_search
                    .split(" ")
                    .map((item) => `%${item}%`);
                condition.coupon_code = {
                    [Op.iLike]: {
                        [Op.any]: coupon_code_seperatedQuery,
                    },
                }
            }
            if (req.query.title) {
                var coupon_title = req.query.title
                const coupon_title_seperatedQuery = coupon_title
                    .split(" ")
                    .map((item) => `%${item}%`);
                condition.title = {
                    [Op.iLike]: {
                        [Op.any]: coupon_title_seperatedQuery,
                    },
                }
            }
            if (req.query.start) {
                var coupon_start = req.query.start
                condition.start = {
                    [Op.gte]: coupon_start
                }
            }
            if (req.query.end) {
                var coupon_end = req.query.end
                condition.end = {
                    [Op.lte]: coupon_end,
                }
            }
            if (req.query.disc_percent) {
                var coupon_disc_percent = req.query.disc_percent
                condition.disc_percent = coupon_disc_percent
            }
            if (req.query.flat_discount) {
                var coupon_flat_discount = req.query.flat_discount
                condition.flat_discount = coupon_flat_discount
            }
            if (req.query.customer_no) {
                var coupon_customer_no = req.query.customer_no
                const coupon_customer_no_seperatedQuery = coupon_customer_no
                    .split(" ")
                    .map((item) => `%${item}%`);
                condition.customer_no = {
                    [Op.iLike]: {
                        [Op.any]: coupon_customer_no_seperatedQuery,
                    },
                }
            }
            if (req.query.employee_id) {
                var coupon_employee_id = req.query.employee_id
                const coupon_employee_id_seperatedQuery = coupon_employee_id
                    .split(" ")
                    .map((item) => `%${item}%`);
                condition.employee_id = {
                    [Op.iLike]: {
                        [Op.any]: coupon_employee_id_seperatedQuery,
                    },
                }
            }

            if (req.query.branch_id) {
                var coupon_branch_id = req.query.branch_id
                const coupon_branch_id_seperatedQuery = coupon_branch_id
                    .split(" ")
                    .map((item) => `%${item}%`);
                condition.branch_id = {
                    [Op.iLike]: {
                        [Op.any]: coupon_branch_id_seperatedQuery,
                    },
                }
            }

            if (req.query.min_cart) {
                var coupon_min_cart = req.query.min_cart
                condition.employee_id = {
                    [Op.gte]: coupon_min_cart,
                }
            }

            if (req.query.customer_group_name) {
                var coupon_customer_group_name = req.query.customer_group_name
                const coupon_customer_group_name_seperatedQuery = coupon_customer_group_name
                    .split(" ")
                    .map((item) => `%${item}%`);
                condition.customer_group_name = {
                    [Op.iLike]: {
                        [Op.any]: coupon_customer_group_name_seperatedQuery,
                    },
                }
            }

            const data = await coupons.findAll({
                offset: pgnum, limit: per_page,
                where: condition
            });

            const total_coup_count = await coupons.count({
                where: condition
            });

            if (data.length != 0) {
                res.json({
                    status: "success",
                    total_coup_count,
                    data
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
            res.json({
                status: "failure",
                msg: err
            });
        }
    }

    async search_employees(req, res) {
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

            if (req.query.search) {
                var search = req.query.search
                const seperatedQuery = search
                    .split(" ")
                    .map((item) => `%${item}%`);

                const data = await employee.findAll({
                    offset: pgnum, limit: per_page,
                    where: {
                        [Op.and]: {
                            [Op.or]: {
                                full_name: {
                                    [Op.iLike]: {
                                        [Op.any]: seperatedQuery,
                                    },
                                },
                                mobile_no: {
                                    [Op.iLike]: {
                                        [Op.any]: seperatedQuery,
                                    },
                                },
                                email: {
                                    [Op.iLike]: {
                                        [Op.any]: seperatedQuery,
                                    },
                                },
                                address: {
                                    [Op.iLike]: {
                                        [Op.any]: seperatedQuery,
                                    },
                                },
                                status: {
                                    [Op.iLike]: {
                                        [Op.any]: seperatedQuery,
                                    },
                                },
                                employee_role: {
                                    [Op.iLike]: {
                                        [Op.any]: seperatedQuery,
                                    },
                                },
                                gender: {
                                    [Op.iLike]: {
                                        [Op.any]: seperatedQuery
                                    }
                                }
                            },
                        }
                    },

                });

                const total_emp_count = await employee.count({
                    where: {
                        [Op.and]: {
                            [Op.or]: {
                                full_name: {
                                    [Op.iLike]: {
                                        [Op.any]: seperatedQuery,
                                    },
                                },
                                mobile_no: {
                                    [Op.iLike]: {
                                        [Op.any]: seperatedQuery,
                                    },
                                },
                                email: {
                                    [Op.iLike]: {
                                        [Op.any]: seperatedQuery,
                                    },
                                },
                                address: {
                                    [Op.iLike]: {
                                        [Op.any]: seperatedQuery,
                                    },
                                },
                                status: {
                                    [Op.iLike]: {
                                        [Op.any]: seperatedQuery,
                                    },
                                },
                                employee_role: {
                                    [Op.iLike]: {
                                        [Op.any]: seperatedQuery,
                                    },
                                },
                                gender: {
                                    [Op.iLike]: {
                                        [Op.any]: seperatedQuery
                                    }
                                }
                            },
                        }
                    },
                });

                if (data.length != 0) {
                    res.json({
                        status: "success",
                        total_emp_count,
                        data
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
            res.json({
                status: "failure",
                msg: err
            });
        }
    }

    async fetch_all_customer_groups(req, res) {
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
            const data = await customer_group.findAll({
                offset: pgnum, limit: per_page
            });
            const total_groups = await customer_group.count();
            if (data) {
                res.json({
                    status: "success",
                    total_groups,
                    data
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
            res.json({
                status: "failure",
                msg: err
            });
        }
    }

    async update_coupons(req, res) {
        try {
            const coupon_id = req.body.coupon_id;
            const coupon_found = await coupons.findOne({
                where: {
                    coupon_id: coupon_id
                }
            });
            if (coupon_found) {
                const updated_coupon = await coupons.update(req.body, {
                    where: {
                        coupon_id: coupon_id
                    }
                });
                if (updated_coupon[0]) {
                    res.json({
                        status: "success",
                        msg: "Coupon updated successfully!"
                    });
                }
                else {
                    res.json({
                        status: "failure",
                        msg: "Coupon not updated!"
                    });
                }
            }
            else {
                res.json({
                    status: "failure",
                    msg: "Coupon not found!"
                });
            }
        }
        catch (err) {
            console.log(err);
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

    async add_coupon(req, res) {
        try {
            var coupon_code = req.body.coupon_code
            const find_coupon = await coupons.findOne({
                where:{
                    coupon_code
                }
            })
            if(find_coupon){
                res.json({
                    status: "failure",
                    msg: "Already Coupon with same CODE added!"
                });
            }else{
                const new_coupon = await coupons.create(req.body)
                if (new_coupon) {
                    res.json({
                        status: "success",
                        data: new_coupon
                    });
                }
                else {
                    res.json({
                        status: "failure",
                        msg: "Coupon not added!"
                    });
                }
            }
           

        } catch (err) {
            res.json({
                status: "failure",
                msg: err
            });
        }
    }

    async delete_coupons(req, res) {
        try {
            const coupon_id = req.params.coupon_id;
            const coupon_found = await coupons.findOne({
                where: {
                    coupon_id: coupon_id
                }
            });
            if (coupon_found) {
                const deleted_coupon = await coupons.destroy({
                    where: {
                        coupon_id: coupon_id
                    }
                });
                if (deleted_coupon) {
                    res.json({
                        status: "success",
                        msg: "Coupon deleted successfully!"
                    });
                }
                else {
                    res.json({
                        status: "failure",
                        msg: "Coupon not deleted!"
                    });
                }
            }
            else {
                res.json({
                    status: "failure",
                    msg: "Coupon not found!"
                });
            }
        }
        catch (err) {
            console.log(err);
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

    async update_customer_roles(req, res) {
        try {
            console.log(req.body)
            const updated_customer_roles = await customer_roles.update(req.body, {
                where: {
                    customer_type: req.query.customer_type
                }
            });
            if (updated_customer_roles[0]) {
                res.json({
                    status: "success",
                    msg: "Customer role updated successfully!"
                });
            }
            else {
                res.json({
                    status: "failure",
                    msg: "Customer role not updated!"
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

module.exports = new adminAllCouponsController();


