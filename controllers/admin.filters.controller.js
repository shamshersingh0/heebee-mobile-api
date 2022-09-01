const sequelize = require("sequelize");
const Op = sequelize.Op;
const { employee,orders,order_items,franchise,branch
} = require("../models");

class filtersController {

    async get_filters(req,res){
        try{
            // Owner and Super admin condition
            if(req.query.role == "Owner" || req.query.role == "Super Admin"){
                var data = await franchise.findAll({
                    attributes:["franchise_id","franchise_name"],
                    include:{
                        model:branch,
                        attributes:["branch_id","branch_name"]
                    }
                });
                let arr = []
                let allfranchise = {
                    "franchise_id":"All",
                    "franchise_name":"All"
                }
                let allBranches = []
                allBranches.push({
                    "branch_id":"All",
                    "branch_name":"All"
                });
                allfranchise["branches"] = allBranches;
                arr.push(allfranchise);
                for(var i = 0;i < data.length;i++){
                    arr.push(data[i].dataValues) ;
                }
                res.json({
                    status: "success",
                    data: arr,
                });
            }
            // region Head Condition
            else if(req.query.role == "Region Head"){
                var data = await franchise.findAll({
                    where:{
                        franchise_id: req.query.franchise_id
                    },
                    include:{
                        model:branch,
                        // where:{
                        //     region:req.query.region
                        // },
                        attributes:["branch_id","branch_name"]
                    },
                    attributes:["franchise_id","franchise_name"],
                });
                let allBranch = {
                    "branch_id":"All",
                    "branch_name":"All"
                }
                let arr = []
                for(var i = 0;i < data.length;i++){
                    arr.push(data[i].dataValues) ;
                }
                // unshift adds element to the beginning of an array
                arr[0].branches.unshift(allBranch);
                res.json({
                    status: "success",
                    data: arr
                });
            }
            // Manager Condition
            // else if(req.query.role === "Manager"){
                else{
                const data = await franchise.findOne({
                    include:{
                        model:branch,
                        where:{
                            branch_id:req.query.branch
                        },
                        attributes:["branch_id","branch_name"]
                    },
                    attributes:["franchise_id","franchise_name"],
                });
                res.json({
                    status: "success",
                    data: data
                });
            }
        }
        catch(err){
            console.log(err);
            res.status(500).json({
                status: "failure",
                msg: err
            });
        }
    }
}

module.exports = new filtersController();