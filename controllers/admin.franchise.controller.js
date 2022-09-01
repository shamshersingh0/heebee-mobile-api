const sequelize = require("sequelize");
const Op = sequelize.Op;
const { employee, customer, orders, order_items, categories, product, product_list,
   franchise, branch, category_list, add_ons, add_on_option, per_product_add_ons, order_history,
   order_items_history, employee_roles, coupons
} = require("../models");

class adminFranchiseController {

   // Add New franchise....working
   async addfranchise(req, res) {
      try {
         const { location, franchise_name, no_branches } = req.body;
         const franchise_info = await franchise.create({ franchise_name, location, no_branches });
         res.json({ "status": "success", "data": franchise_info })
      }
      catch (err) {
         console.log(err);
         res.status(500).json({ "status": "failure", "msg": err });
      }
   }
   // get Franchise Information..working
   async getfranchise(req, res) {
      try {
         const franchise_id = req.query.franchise;
         if (franchise_id) {
            const data = await franchise.findOne({
               where: {
                  franchise_id
               },
               include: branch
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
                  msg: "no data found"
               });
            }
         }
         else {
            const data = await franchise.findAll({ include: { model: branch } });
            res.json({
               status: "success",
               data: data
            });
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
   // getsinglebranch
   async getsinglebranch(req, res) {
      try {
         const branch_id = req.query.branch;
         const data = await branch.findOne({
            where: {
               branch_id
            },
            include: [
               {
                  model: categories,
                  attributes: {
                     exclude: ["createdAt", "updatedAt"]
                  },
                  include: [
                     {
                        model: category_list,
                        attributes: {
                           exclude: ["createdAt", "updatedAt"]
                        },
                     },
                     {
                        model: product,
                        attributes: {
                           exclude: ["createdAt", "updatedAt"]
                        },
                        include: [
                           {
                              model: product_list,
                              attributes: {
                                 exclude: ["createdAt", "updatedAt"]
                              },
                           },
                        ]
                     }
                  ],
               },
               // {
               //    model: category_list,
               //    attributes: {
               //       exclude: ["createdAt", "updatedAt"]
               //    },
               // },
            ],
            attributes: {
               exclude: ["createdAt", "updatedAt"]
            }
         });
         if (data) {
            res.json({
               status: "success",
               data: data
            })
         }
         else {
            res.json({
               status: "failure",
               msg: "branch details not found"
            })
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

   // Get Branch info...working
   async getbranch(req, res) {
      try {
         const branch_id = req.query.branch;
         if (branch_id) {
            const data = await branch.findOne({
               where: {
                  branch_id
               },
               attributes: {
                  exclude: ["createdAt", "updatedAt"]
               }
            });
            if (data) {
               res.json({
                  status: "success",
                  data: data
               })
            }
            else {
               res.json({
                  status: "failure",
                  msg: "branch details not found"
               })
            }
         }
         else {
            const data = await branch.findAll({
               attributes: {
                  exclude: ["createdAt", "updatedAt"]
               }
            });
            res.json({ status: "success", data: data });
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

   // get_product_branch
   async get_product_branch(req, res) {
      try {
         const branch_id = req.query.branch_id;
         if (branch_id) {
            // const product_data = await product.findAll({
            //    where: {
            //       branch_id
            //    },
            //    include: { model: product_list },

            //    attributes: {
            //       exclude: ["createdAt", "updatedAt"]
            //    }
            // });

            const categ_data = await categories.findAll({
               where: {
                  branch_id
               },
               include: [
                  {
                     model: product,
                     attributes: {
                        exclude: ["createdAt", "updatedAt"]
                     },
                     include: [
                        {
                           model: product_list,
                           attributes: {
                              exclude: ["createdAt", "updatedAt"]
                           },
                        },
                     ],
                  },
                  {
                     model: category_list,
                     attributes: {
                        exclude: ["createdAt", "updatedAt"]
                     },
                  },
               ],
               // include:
               //    { model: category_list },
               // attributes: {
               //    exclude: ["createdAt", "updatedAt"]
               // }
            });
            // console.log(product_data)
            // console.log(categ_data)

            // var data = [];
            // var newArr;
            // for (var i = 0; i < 1; i++) {
            // }
            if (categ_data) {
               res.json({
                  status: "success",
                  // newArr,
                  // product_data,
                  categ_data
               })
            }
            else {
               res.json({
                  status: "failure",
                  msg: "branch details not found"
               })
            }
         }
         // else {
         //    const data = await branch.findAll({
         //       attributes: {
         //          exclude: ["createdAt", "updatedAt"]
         //       }
         //    });
         //    res.json({ status: "success", data: data });
         // }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: "no data found"
         });
      }
   }

   // get_product_list
   async get_product_list(req, res) {
      try {
         const data = await product_list.findAll({
         });
         if (data.length != 0) {
            res.json({
               status: "success",
               data
            });
         } else {
            res.json({
               status: "failure"
            });
         }
      } catch (err) {
         res.json({ "status": "failure", err })
      }
   }

   // get_category_list
   async get_category_list(req, res) {
      try {
         const data = await category_list.findAll({
         });
         if (data.length != 0) {
            res.json({
               status: "success",
               data
            });
         } else {
            res.json({
               status: "failure"
            });
         }
      } catch (err) {
         res.json({ "status": "failure", err })
      }
   }

   // search_product
   async search_product(req, res) {
      try {
         var search = req.query.search
         const seperatedQuery = search
            .split(" ")
            .map((item) => `%${item}%`);
         const data = await product_list.findAll({
            where: {
               product_name: { [Op.iLike]: { [Op.any]: seperatedQuery } },
            }
         });
         if (data.length != 0) {
            res.json({
               status: "success",
               data
            });
         } else {
            res.json({
               status: "failure"
            });
         }
      } catch (err) {
         res.json({ "status": "failure", err })
      }
   }

   // Add New Branch...working
   async addnewbranchcopy(req, res) {
      try {
         const { branch_name, city, region, address, franchise_id, cat_branch } = req.body;
         // create branch and add category and product compulsary
         const data = await branch.create({ branch_name, city, region, address, franchise_id });
         console.log(data.branch_id)
         var branch_id = data.branch_id
         // var branch_id = "51d0409b-d99c-4aec-bbd3-0450ebc367a2"
         var cat_cr = [];
         var prod_cr = [];
         var price = 0;
         var status = true;
         for (var i = 0; i < cat_branch.length; i++) {
            var obj = {}
            obj.category_list_id = cat_branch[i].category_list_id
            obj.branch_id = branch_id
            cat_cr.push(obj)
            var result1 = await categories.create(obj);
            // console.log(cat_cr)
            // console.log("result1", result1.category_id)
            // console.log("cat_branch[i].product_list_id.length", cat_branch[i].product_list_id.length)
            for (var j = 0; j < cat_branch[i].product_list_id.length; j++) {
               var obj2 = {}
               // console.log("j", j)
               obj2.product_list_id = cat_branch[i].product_list_id[j].id
               obj2.branch_id = branch_id
               obj2.category_id = result1.category_id
               obj2.status = status
               obj2.price = price
               obj2.items_available = cat_branch[i].product_list_id[j].items_available
               prod_cr.push(obj2)
            }
         }
         // console.log("cat_cr", cat_cr)
         // console.log("prod_cr", prod_cr)

         const result = await product.bulkCreate(prod_cr);
         res.json({
            "status": "successully added",
            data,
            prod: result
         })
      }
      catch (err) {
         console.log(err);
         res.status(500).json({ "status": "failure", "msg": err });
      }
   }

   // Add New Branch...working
   async addnewbranch(req, res) {
      try {
         const { branch_name, city, region, address, franchise_id, cat_branch } = req.body;
         // create branch and add category and product compulsary
         const data = await branch.create({ branch_name, city, region, address, franchise_id });
         console.log(data.branch_id)
         var branch_id = data.branch_id
         // var branch_id = "51d0409b-d99c-4aec-bbd3-0450ebc367a2"
         var cat_cr = [];
         var prod_cr = [];
         var price = 0;
         var status = true;
         for (var i = 0; i < cat_branch.length; i++) {
            var obj = {}
            obj.category_list_id = cat_branch[i].category_list_id
            obj.branch_id = branch_id
            cat_cr.push(obj)
            var result1 = await categories.create(obj);
            // console.log(cat_cr)
            // console.log("result1", result1.category_id)
            // console.log("cat_branch[i].product_list_id.length", cat_branch[i].product_list_id.length)
            for (var j = 0; j < cat_branch[i].product_list_id.length; j++) {
               var obj2 = {}
               // console.log("j", j)
               obj2.product_list_id = cat_branch[i].product_list_id[j].id
               obj2.branch_id = branch_id
               obj2.category_id = result1.category_id
               obj2.status = status
               obj2.price = cat_branch[i].product_list_id[j].price
               obj2.items_available = cat_branch[i].product_list_id[j].items_available
               prod_cr.push(obj2)
            }
         }
         // console.log("cat_cr", cat_cr)
         // console.log("prod_cr", prod_cr)

         const result = await product.bulkCreate(prod_cr);
         res.json({
            "status": "successully added",
            data,
            prod: result
         })
      }
      catch (err) {
         console.log(err);
         res.status(500).json({ "status": "failure", "msg": err });
      }
   }


   // add_cat_branch
   async add_cat_branch(req, res) {
      try {
         const { branch_id, category_list_id, product_list } = req.body;
         const data = await categories.findOne({
            where: { branch_id, category_list_id }
         })
         if (data) {
            res.json({
               "status": "failure",
               "Msg": "Already Added"
            })
         } else {
            var result1 = await categories.create({
               branch_id,
               category_list_id
            });
            var prod_cr = [];
            for (var j = 0; j < product_list.length; j++) {
               var obj2 = {}
               // console.log("j", j)
               obj2.product_list_id = product_list[j].id
               obj2.branch_id = branch_id
               obj2.category_id = result1.category_id
               obj2.price = product_list[j].price
               obj2.items_available = product_list[j].items_available
               prod_cr.push(obj2)
            }
            const result = await product.bulkCreate(prod_cr);
            res.json({
               "status": "successully added",
               prod: result
            })
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({ "status": "failure", "msg": err });
      }
   }


   //edit franchise...working
   async editfranchise(req, res) {
      try {
         const { franchise_id } = req.body
         const data = await franchise.findOne({
            where: { franchise_id }
         })
         if (data) {
            data.set(req.body)
            await data.save()

            res.json({ "status": "success", data })
         } else {
            res.json({ "status": "failure", msg: "No franchise found!" })
         }


      } catch (err) {
         res.json({ "status": "failure", err })
      }
   }

   // edit branch...working
   async editbranch(req, res) {
      try {
         const { branch_id, branch_name, city, region, franchise_id, address } = req.body
         const data = await branch.findOne({
            where: { branch_id }
         })

         data.set({
            branch_name: branch_name,
            city: city,
            region: region,
            franchise_id: franchise_id,
            address: address
         })
         await data.save()

         res.json({ "msg": "success", data })


      } catch (err) {
         res.json({ "status": "failure", err })
      }
   }

   // add_product_branch
   async add_product_branch(req, res) {
      try {
         const { product_list_id, branch_id, category_id, items_available, price } = req.body
         const find_franch = await product.findOne({
            where: {
               branch_id,
               category_id,
               product_list_id
            }
         })
         if (find_franch) {
            res.json({ "msg": "failure", msg: "Already Added!", find_franch })
         } else {
            const data = await product.create(req.body)
            res.json({ "msg": "success", data })
         }
      } catch (err) {
         res.json({ "status": "failure", err })
      }
   }
   // del_product_branch
   async del_product_branch(req, res) {
      try {
         const product_id = req.query.product_id
         const data = await product.destroy({
            where: {
               product_id
            }
         });
         if (data) {
            res.json({
               status: "success",
               msg: "Product deleted successfully!"
            });
         }
      } catch (err) {
         res.json({ "status": "failure", err })
      }
   }




   //delete franchise....working..
   async deletefranchise(req, res) {
      try {
         const fid = req.query.id
         const data = await franchise.findOne({
            where: { franchise_id: fid }
         })

         if (data) {
            //res.json({data})
            let allids = []
            franchise.destroy({
               where: { franchise_id: fid }
            })

            const allbranches = await branch.findAll({
               where: { franchise_id: data.franchise_id },
               attributes: {
                  exclude: ["branch_name", "city", "region", "franchise_id", "address", "createdAt", "updatedAt"]
               }
            })
            // for (var j = 0; j < allbranches.length; j++) {
            //    allids.push(allbranches[j].dataValues['branch_id'])
            // }

            await branch.destroy({
               where: {
                  branch_id: {
                     [Op.in]: allbranches.map((d) => d.branch_id)
                  }
               }
            })

            await categories.destroy({
               where: {
                  branch_id: {
                     [Op.in]: allbranches.map((d) => d.branch_id)
                  }
               }
            })

            await product.destroy({
               where: {
                  branch_id: {
                     [Op.in]: allbranches.map((d) => d.branch_id)
                  }
               }
            })

            //    coupons.destroy({
            //       where:{branch_id:allids[i]}
            //    })

            //    customer.destroy({
            //       where:{branch_id:allids[i]}
            //    })

            //    employee.destroy({
            //       where:{branch_id:allids[i]}
            //    })

            //    order_history.destroy({
            //       where:{branch_id:allids[i]}
            //    })

            //    orders.destroy({
            //       where:{branch_id:allids[i]}
            //    })

            res.json({ "msg": "deleted" })

         } else {
            res.json({ "msg": "failure", "err": "no data found" })
         }


      } catch (err) {
         res.json({ "msg": "error11", err })
      }
   }

   // delete branch....working..
   async deletebranch(req, res) {
      try {
         const bid = req.query.branch_id
         const data = await branch.findOne({
            where: { branch_id: bid }
         })
         //res.json({data})

         if (data) {
            await branch.destroy({
               where: { branch_id: bid }
            })

            await categories.destroy({
               where: { branch_id: bid }
            })

            await coupons.destroy({
               where: { branch_id: data.branch_id }
            })

            await product.destroy({
               where: { branch_id: data.branch_id }
            })

            // customer.destroy({
            //    where:{branch_id:data.branch_id}
            // })

            // employee.destroy({
            //    where:{branch_id:data.branch_id}
            // })

            // order_history.destroy({
            //    where:{branch_id:data.branch_id}
            // })

            // orders.destroy({
            //    where:{branch_id:data.branch_id}
            // })

            res.json({ "msg": "deleted", data })

         } else {
            res.json({ "msg": "failure", "err": "no data found" })
         }

      } catch (err) {
         console.log(err)
         res.json({ "msg": "error", err })
      }
   }

   // delete_cat_branch
   async delete_cat_branch(req, res) {
      try {
         const category_id = req.query.category_id

         const data = await categories.findOne({
            where: { category_id }
         })
         if (data) {
            await product.destroy({
               where: { category_id }
            })
            await categories.destroy({
               where: { category_id }
            })
            res.json({ "msg": "deleted", data })
         } else {
            res.json({ "msg": "failure", "err": "no data found" })
         }

      } catch (err) {
         res.json({ "msg": "error", err })
      }
   }

}

module.exports = new adminFranchiseController();