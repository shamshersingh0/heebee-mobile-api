const jwt = require('jsonwebtoken');
const {employee,customer, admin } = require('../models');

const auth = async (req, res, next) => {
    try {
        const token = req.headers.token;
        const role = req.headers.role;
        // console.log(token);
        if (token) {
            const decoded = await jwt.verify(token, process.env.JWT_SECRET_TOKEN_SIGNATURE);
            let data = await employee.findOne({
                where: { token: token }
            });
            if (data && role) {
                if (data.employee_role === role) {
                    next();
                }
                else {
                    res.json({
                        status: "failure",
                        status_code: 450,
                        msg: "You are not authorized"
                    })
                }
            }
            else if (data && !role) {
                next();
            }
            else {
                res.json({
                    status: "failure",
                    status_code: 450,
                    data: "Token does not match"
                });
            }
        }
        else {
            res.json({
                status: "failure",
                data: "Token Not found"
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            status: "failure",
            msg: "Token Error"
        });
    }
}


const customer_auth = async (req, res, next) => {
    try{
        const token = req.headers.token;
        if(token){
            const decoded = await jwt.verify(token, process.env.JWT_SECRET_TOKEN_SIGNATURE);
            let data = await customer.findOne({ 
                where:{token:token}
            });
            if(data){
                next();
            }
            else{
                res.json({
                    status: "failure",
                    data: "Token does not match"
                });
            }
           
        }
        else{
            res.json({
                status: "failure",
                data: "Token Not found"
            });
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            status: "failure",
            msg: "Token Error"
        });
    }
}
const admin_auth = async (req, res, next) => {
    try{
        const token = req.headers.token;
        if(token){
            const decoded = await jwt.verify(token, process.env.JWT_SECRET_TOKEN_SIGNATURE);
            let data = await admin.findOne({ 
                where:{token:token}
            });
            if(data){
                next();
            }
            else{
                res.json({
                    status: "failure",
                    data: "Token does not match"
                });
            }
           
        }
        else{
            res.json({
                status: "failure",
                data: "Token Not found"
            });
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            status: "failure",
            data: "Token Error"
        });
    }
}


module.exports = {auth,customer_auth,admin_auth};