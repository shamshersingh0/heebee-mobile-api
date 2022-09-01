const sequelize = require("sequelize");
const { employee, customer, orders, order_items, categories, product, product_list,
   franchise, branch, category_list, add_ons, add_on_option, per_product_add_ons, order_history,
   order_items_history, employee_roles, coupons
} = require("../models");

class mobileCategories {
    async allCategory(req, res){
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
            const branch_id = req.query.branch_id
            const data = await categories.findAll({
                offset: pgnum, limit: per_page,
                where:{
                    branch_id:branch_id
                },
                include:[{
                    model:category_list
                }],
                offset: pgnum,
                limit: per_page,
                // order: [
                //     ['id', 'ASC'],
                // ],
            });
            const request_item_count = await categories.count();
            if (data) {
                res.json({
                    request_item_count,
                    data

                });
            }
            else {
                res.json({
                    msg: "No data found!"
                })
            }
        }
        catch (err) {
            console.log(err);
            res.json({
                msg: err
            });
        }
    }

async singleCategory(req, res){
try{
    var pgnum = req.params.number;
            var per_page = 10;
            if (!pgnum) {
                pgnum = 0;
            } else if (pgnum > 0) {
                pgnum = (pgnum - 1) * per_page;
            } else {
                pgnum = 0;
            }
    const id = req.query.category_id

    const singlecatdata = await categories.findOne({
        offset: pgnum, limit: per_page,
        where:{
            category_id:id
        },
        include:[
            {
                model:product,
                include:[{
                    model: product_list,
                    include:[{
                       model:per_product_add_ons,
                        include:[{
                         model:add_ons,
                         include:[{
                            model:add_on_option
                         }]
                        }]
                        
                    }]
                }]
        }
    ]
    })

    const Total_category = await categories.count();
    if(singlecatdata){
        res.json({ 
            Total_category,
            singlecatdata
        })
    }else{
       res.json({
        msg:'Not found'
       })
    }
}catch(err){
    res.json({err})
}
}

async fetchAllProduct(req, res){
    try{
        var pgnum = req.params.number;
            var per_page = 10;    
            if (!pgnum) {
                pgnum = 0;
            } else if (pgnum > 0) {
                pgnum = (pgnum - 1) * per_page;
            } else {
                pgnum = 0;
            }
       const search = req.query.branch_id
       const data = await product.findAll({
        offset: pgnum, limit: per_page,
        where:{
           branch_id: search
        },
        include: {
            model: product_list,
            include: {
               model: per_product_add_ons,
               include: {
                  model: add_ons,
                  include: {
                     model: add_on_option
                  }
               }
            }
         },
       })
       const request_item_count = await product.count();
       if(product){
        res.json({
            request_item_count,
            data
        })
       }else{
        res.json({
            msg:"Not found"
        })
       }
    }catch(err){
        console.log(err)
        res.json({err})
    }
}

async fetchSingleProduct(req, res){
    try{
        const id = req.query.product_id
        const data = await product.findOne({
            where:{
                product_id:id
            },
            include: {
                model: product_list,
                include: {
                   model: per_product_add_ons,
                   include: {
                      model: add_ons,
                      include: {
                         model: add_on_option
                      }
                   }
                }
             },
        })
        if(data){
            res.json({
                data
            })
           }else{
            res.json({
                msg:"Not found"
            })
           }
        }catch(err){
            res.json({err})
        }  
}

async mostOrderedProduct (req, res){
    try{
        var pgnum = req.params.number;
            var per_page = 10;    
            if (!pgnum) {
                pgnum = 0;
            } else if (pgnum > 0) {
                pgnum = (pgnum - 1) * per_page;
            } else {
                pgnum = 0;
            }
        const id = req.query.branch_id
        const data = await product.findAll({
            offset: pgnum, limit: per_page,
            where:{
                branch_id:id
            },
            group: ["product_id"],
            include: {
                model: product_list,
                include: {
                   model: per_product_add_ons,
                   include: {
                      model: add_ons,
                      include: {
                         model: add_on_option
                      }
                   }
                }
             },
        })

        const productCount = await product.count();
        if(product){
        res.json({
            productCount,
            data
        })
        }else{
            res.json({
                msg:"Not Found"
            })
        }
    }catch(err){
        console.log(err)
        res.json({err})
    } 
}
}

module.exports = new mobileCategories();