const sequelize = require("sequelize");
const Op = sequelize.Op;

const {
    admin_permissions
} = require("../models");

class adminPermissionsController {

    async add_permissions(req, res) {
        try {
            const data = await admin_permissions.create(req.body);
            if (data) {
                res.json({
                    status: "success",
                    msg: "Admin Permission Added Successfully",
                    data: data
                });
            }
            else {
                res.json({
                    status: "failure",
                    msg: "Admin Permission Not Added"
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

    async edit_permissions(req, res) {
        try {
            const data = await admin_permissions.findAll({
                where: {
                    admin_id: req.body.admin_id,
                    module: req.body.module
                }
            });
            if (data.length != 0) {
                const data = await admin_permissions.update(req.body, {
                    where: {
                        admin_id: req.body.admin_id,
                        module: req.body.module
                    }
                });
                if (data[0]) {
                    res.json({
                        status: "success",
                        msg: "Admin Permission Updated Successfully"
                    });
                }
                else {
                    res.json({
                        status: "failure",
                        msg: "Admin Permission Update Failed"
                    });
                }
            }
            else {
                const data = await admin_permissions.create(req.body);
                if (data) {
                    res.json({
                        status: "success",
                        msg: "Admin Permission Added Successfully",
                        data: data
                    });
                }
                else {
                    res.json({
                        status: "failure",
                        msg: "Admin Permission Not Added"
                    });
                }
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

    async fetch_permissions(req, res) {
        try {
            const data = await admin_permissions.findAll({
                where: {
                    admin_id: req.query.admin_id
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
                    msg: "No data Found"
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
}

module.exports = new adminPermissionsController();
