const sequelize = require("sequelize");
const Op = sequelize.Op;
const { admin, admin_role, admin_permissions } = require("../models");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class adminController {
    async admin_signup(req, res) {
        try {
            // Check if admin exists
            const admin_exists = await admin.findOne({ where: { email: req.body.email } });
            if (admin_exists) {
                return res.json({
                    status: "failure",
                    msg: "Admin already exists!"
                });
            }
            if (!req.body.email || !req.body.password || !req.body.admin_role_id || !req.body.branch_id || !req.body.franchise_id) {
                return res.json({
                    status: "failure",
                    msg: "Please send all required variables!"
                });
            }
            // Password hashing 
            req.body.password = await bcrypt.hash(req.body.password, 10);
            const token = await jwt.sign({ email: req.body.email }, process.env.JWT_SECRET_TOKEN_SIGNATURE);
            req.body.token = token;
            const new_admin = await admin.create(req.body);
            var Permissions = req.body.Permissions;
            console.log(Permissions.length)
            console.log(new_admin.admin_id)
            for (var i = 0; i < Permissions.length; i++) {
                Permissions[i].admin_id = new_admin.admin_id;
            }
            console.log(Permissions)
            const result1 = await admin_permissions.bulkCreate(Permissions);
            // const add_permission = await admin.create(req.body);

            res.json({
                status: "success",
                msg: "Admin Created Successfully",
                data: new_admin
            });
        }
        catch (err) {
            console.log(err);
            res.status(500).json({
                status: "failure",
                msg: err
            })
        }
    }

    async admin_login(req, res) {
        try {
            let { email, password } = req.body;
            const admin_exists = await admin.findOne({ where: { email } });
            if (admin_exists) {
                const is_match = await bcrypt.compare(password, admin_exists.password);
                if (is_match) {
                    const token = await jwt.sign({ email }, process.env.JWT_SECRET_TOKEN_SIGNATURE, { expiresIn: '30d' });
                    const last_logged_in = new Date();
                    // storing token and updating last_logged in status
                    const update_admin = await admin.update({ token, last_logged_in }, {
                        where: {
                            admin_id: admin_exists.admin_id
                        }
                    });
                    res.status(200).json({
                        status: "success",
                        msg: "Login Successfull",
                        token: token
                    });
                }
                else {
                    res.json({
                        status: "failure",
                        msg: "email or password wrong"
                    });
                }
            }
            else {
                res.json({
                    status: "failure",
                    msg: "Admin does not exists"
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
    // all_admin
    async fetch_all_admin(req, res) {
        try {
            const admins = await admin.findAll();
            if (admins.length != 0) {
                res.status(200).json({
                    status: "success",
                    admins
                });
            }
            else {
                res.json({
                    status: "failure",
                    msg: "Admin does not exists"
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

    // all_admin
    async fetch_single_admin(req, res) {
        try {
            const admins = await admin.findAll({
                where: {
                    admin_id: req.query.admin_id
                },
                include: [
                    { model: admin_role, attributes: { exclude: ["createdAt", "updatedAt"] } },
                    { model: admin_permissions, attributes: { exclude: ["createdAt", "updatedAt"] } }]
            });
            if (admins.length != 0) {
                res.status(200).json({
                    status: "success",
                    admins
                });
            }
            else {
                res.json({
                    status: "failure",
                    msg: "Admin does not exists"
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

    async update_admin_info(req, res) {
        try {
            const admin_id = req.body.admin_id;
            if(req.body.password){
                req.body.password = await bcrypt.hash(req.body.password, 10);
            }
            const update = await admin.update(req.body, { where: { admin_id } });
            var Permissions = req.body.Permissions;
            console.log(Permissions.length)
            for (var i = 0; i < Permissions.length; i++) {
                var update_permission = await admin_permissions.update({
                    "module": Permissions[i].module,
                    "read": Permissions[i].read,
                    "write": Permissions[i].write
                }, { where: { admin_id, module: Permissions[i].module } });
                if (!update_permission[0]) {
                    const add_permission = await admin_permissions.create({
                        "module": Permissions[i].module,
                        "read": Permissions[i].read,
                        "write": Permissions[i].write,
                        admin_id
                    });
                }
            }
            if (update[0]) {
                res.json({
                    status: "success",
                    msg: "info updated"
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
            })
        }
    }

    async get_admin_info(req, res) {
        try {
            // Decoding token
            const decoded = await jwt.verify(req.headers.token, process.env.JWT_SECRET_TOKEN_SIGNATURE);
            let data = await admin.findOne({
                where: { email: decoded.email },
                include: [
                    { model: admin_role, attributes: { exclude: ["createdAt", "updatedAt"] } },
                    { model: admin_permissions, attributes: { exclude: ["createdAt", "updatedAt"] } }
                ]
            });
            // Matching token from database table
            if (req.headers.token === data.token) {
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
                msg: err
            })
        }
    }

    // fetch admin roles
    async get_admin_roles(req, res) {
        try {
            const All_admin_role = await admin_role.findAll();
            res.json({
                status: "success",
                data: All_admin_role
            });
        }
        catch (err) {
            console.log(err);
            res.status(500).json({
                status: "failure",
                msg: err
            })
        }
    }

    async add_admin_role(req, res) {
        try {
            const new_admin_role = await admin_role.create(req.body);
            res.json({
                status: "success",
                msg: "Admin Role Added Successfully",
                data: new_admin_role
            });

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

module.exports = new adminController();