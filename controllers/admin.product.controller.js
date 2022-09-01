const sequelize = require("sequelize");
require("dotenv").config();
const Op = sequelize.Op;
const { categories, product, product_list, franchise, branch, category_list, add_ons, add_on_option, per_product_add_ons } = require("../models");
const multer = require('multer')
const fs = require('fs');
const { where } = require("sequelize");
const upload = multer({
   dest: './uploads',
   // filename: (req, file, cb) => {
   //    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
   // }
})
class adminProductController {

   // Add new Category...working...
   async addcategorycopy(req, res) {
      try {
         const { category_name, description, category_list_id } = req.body;
         let { branch_id, product_id, items_available } = req.body;
         let allids = []
         var card_img = process.env.url + req.file.filename + req.file.originalname
         console.log(req.file)
         // console.log(getCurrentFilenames());
         var new_name = req.file.path + req.file.originalname
         fs.rename(req.file.path, new_name, () => {
            console.log("\nFile Renamed!\n");

            // List all the filenames after renaming
            // getCurrentFilenames();
         });
         // console.log(req.body)
         // console.log(card_img)

         if (branch_id == "All") {
            const new_category = await category_list.create({
               category_name,
               description,
               card_img
            });
            // console.log(new_category.dataValues.category_list_id)
            var new_category_list_id = new_category.dataValues.category_list_id
            // console.log("new_category_list_id", new_category_list_id)
            const all_branch = await branch.findAll({
               raw: true,
               attributes: ["branch_id"]
            });
            // console.log(all_branch)
            //   single_nft.profile_pic = "";
            if (product_id == 'All') {
               const product_all = await product_list.findAll({
                  raw: true,
                  attributes: ["product_list_id", "price"]
               });
               var all_product = []
               for (var i = 0; i < all_branch.length; i++) {
                  all_branch[i].category_list_id = new_category_list_id;
                  var new_cat = await categories.create({
                     branch_id: all_branch[i].branch_id,
                     category_list_id: new_category_list_id
                  });
                  for (var j = 0; j < product_all.length; j++) {
                     // product_all[j].branch_id = all_branch[i].branch_id
                     // product_all[j].category_id = new_category_list_id
                     // product_all[j].status = true
                     // product_all[j].items_available = items_available
                     all_product.push({
                        product_list_id: product_all[j].product_list_id,
                        price: product_all[j].price,
                        branch_id: all_branch[i].branch_id,
                        category_id: new_cat.category_id,
                        status: true,
                        items_available: items_available
                     })
                  }
               }
               // console.log("all_branch", all_branch)
               // console.log("product_all", all_product)
               // const result1 = await categories.bulkCreate(all_branch);
               const result1 = await categories.findAll({
                  where: {
                     category_list_id: new_category_list_id
                  }
               });
               const result = await product.bulkCreate(all_product);
               if (result) {
                  // console.log(result)
                  res.send({ status: "Success", msg: "Successfully added!", new_category, Products: result, categories: result1 });
               } else {
                  res.send({ status: "failure", msg: "Please check sell_id may be already inserted!" });
               }
            } else {
               product_id = await product_id.split(',');
               // console.log("product_idarray", product_id)
               // console.log(product_id.map((item) => item))
               const product_all = await product_list.findAll({
                  where: {
                     product_list_id: product_id
                  },
                  raw: true,
                  attributes: ["product_list_id", "price"]
               });
               // console.log("product_all", product_all)
               var all_product = []
               // console.log("all_branch.length", all_branch.length)
               // console.log("product_all.length", product_all.length)
               for (var i = 0; i < all_branch.length; i++) {
                  // console.log("i", i)
                  all_branch[i].category_list_id = new_category_list_id;
                  var new_cat = await categories.create({
                     branch_id: all_branch[i].branch_id,
                     category_list_id: new_category_list_id
                  });
                  for (var j = 0; j < product_all.length; j++) {
                     // console.log("j", j)
                     all_product.push({
                        product_list_id: product_all[j].product_list_id,
                        price: product_all[j].price,
                        branch_id: all_branch[i].branch_id,
                        category_id: new_cat.category_id,
                        status: true,
                        items_available: items_available
                     })
                  }
               }
               // console.log("all_branch", all_branch)
               // console.log("product_all", all_product)
               // const result1 = await categories.bulkCreate(all_branch);
               const result1 = await categories.findAll({
                  where: {
                     category_list_id: new_category_list_id
                  }
               });
               const result = await product.bulkCreate(all_product);
               if (result) {
                  // console.log(result)
                  res.send({ status: "Success", msg: "Successfully added!", new_category, Products: result, categories: result1 });
               } else {
                  res.send({ status: "failure", msg: "Please check sell_id may be already inserted!" });
               }
            }
         } else {
            const new_category = await category_list.create({
               category_name,
               description,
               card_img
            });
            // console.log(new_category.dataValues.category_list_id)
            var new_category_list_id = new_category.dataValues.category_list_id
            // console.log("new_category_list_id", new_category_list_id)
            console.log(branch_id)
            branch_id = await branch_id.split(',');
            console.log("branch_id", branch_id)
            // console.log(branch_id.map((item) => item))
            const all_branch = await branch.findAll({
               where: {
                  branch_id: branch_id
               },
               raw: true,
               attributes: ["branch_id"]
            });
            // console.log("all_branch", all_branch)
            if (product_id == 'All') {
               const product_all = await product_list.findAll({
                  raw: true,
                  attributes: ["product_list_id", "price"]
               });
                 all_product = []
               // console.log("all_branch.length", all_branch.length)
               // console.log("product_all.length", product_all.length)
               for (var i = 0; i < all_branch.length; i++) {
                  all_branch[i].category_list_id = new_category_list_id;
                  var new_cat = await categories.create({
                     branch_id: all_branch[i].branch_id,
                     category_list_id: new_category_list_id
                  });
                  for (var j = 0; j < product_all.length; j++) {
                     // product_all[j].branch_id = all_branch[i].branch_id
                     // product_all[j].category_id = new_category_list_id
                     // product_all[j].status = true
                     // product_all[j].items_available = items_available
                     all_product.push({
                        product_list_id: product_all[j].product_list_id,
                        price: product_all[j].price,
                        branch_id: all_branch[i].branch_id,
                        category_id: new_cat.category_id,
                        status: true,
                        items_available: items_available
                     })
                  }
               }
               // console.log("all_branch", all_branch)
               // console.log("product_all", all_product)
               // const result1 = await categories.bulkCreate(all_branch);
               const result1 = await categories.findAll({
                  where: {
                     category_list_id: new_category_list_id
                  }
               });
               const result = await product.bulkCreate(all_product);
               if (result) {
                  // console.log(result)
                  res.send({ status: "Success", msg: "Successfully added!", new_category, Products: result, categories: result1 });
               } else {
                  res.send({ status: "failure", msg: "Please check sell_id may be already inserted!" });
               }
            } else {
               product_id = await product_id.split(',');
               // console.log("product_idarray", product_id)
               // console.log(product_id.map((item) => item))
               const product_all = await product_list.findAll({
                  where: {
                     product_list_id: product_id
                  },
                  raw: true,
                  attributes: ["product_list_id", "price"]
               });
               // console.log("product_all", product_all)
               var all_product = []
               // console.log("all_branch.length", all_branch.length)
               // console.log("product_all.length", product_all.length)
               for (var i = 0; i < all_branch.length; i++) {
                  // console.log("i", i)
                  all_branch[i].category_list_id = new_category_list_id;
                  var new_cat = await categories.create({
                     branch_id: all_branch[i].branch_id,
                     category_list_id: new_category_list_id
                  });
                  for (var j = 0; j < product_all.length; j++) {
                     // console.log("j", j)
                     all_product.push({
                        product_list_id: product_all[j].product_list_id,
                        price: product_all[j].price,
                        branch_id: all_branch[i].branch_id,
                        category_id: new_cat.category_id,
                        status: true,
                        items_available: items_available
                     })
                  }
               }
               // console.log("all_branch", all_branch)
               // console.log("product_all", all_product)
               // const result1 = await categories.bulkCreate(all_branch);
               const result1 = await categories.findAll({
                  where: {
                     category_list_id: new_category_list_id
                  }
               });
               const result = await product.bulkCreate(all_product);
               if (result) {
                  // console.log(result)
                  res.send({ status: "Success", msg: "Successfully added!", new_category, Products: result, categories: result1 });
               } else {
                  res.send({ status: "failure", msg: "Please check sell_id may be already inserted!" });
               }
            }
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({ "status": "failure", "msg": err });
      }
   }


   // Add new Category...working...
   async addcategory(req, res) {
      try {
         const { category_name, description, category_list_id } = req.body;
         let { branch_id, product_id, items_available, prices } = req.body;
         let allids = []
         var card_img = process.env.url + req.file.filename + req.file.originalname
         console.log(req.file)
         // console.log(getCurrentFilenames());
         var new_name = req.file.path + req.file.originalname
         fs.rename(req.file.path, new_name, () => {
            console.log("\nFile Renamed!\n");

            // List all the filenames after renaming
            // getCurrentFilenames();
         });
         // console.log(req.body)
         // console.log(card_img)

         if (branch_id == "All") {
            const new_category = await category_list.create({
               category_name,
               description,
               card_img
            });
            // console.log(new_category.dataValues.category_list_id)
            var new_category_list_id = new_category.dataValues.category_list_id
            // console.log("new_category_list_id", new_category_list_id)
            const all_branch = await branch.findAll({
               raw: true,
               attributes: ["branch_id"]
            });
            // console.log(all_branch)
            //   single_nft.profile_pic = "";
            product_id = await product_id.split(',');
            items_available = await items_available.split(',');
            prices = await prices.split(',');
            var all_product = []
            // console.log("all_branch.length", all_branch.length)
            // console.log("product_all.length", product_all.length)
            for (var i = 0; i < all_branch.length; i++) {
               // console.log("i", i)
               all_branch[i].category_list_id = new_category_list_id;
               var new_cat = await categories.create({
                  branch_id: all_branch[i].branch_id,
                  category_list_id: new_category_list_id
               });
               for (var j = 0; j < product_id.length; j++) {
                  // console.log("j", j)
                  all_product.push({
                     product_list_id: product_id[j],
                     price: parseInt(prices[j]),
                     branch_id: all_branch[i].branch_id,
                     category_id: new_cat.category_id,
                     status: true,
                     items_available: parseInt(items_available[j])
                  })
               }
            }
            // console.log("all_branch", all_branch)
            // console.log("product_all", all_product)
            // const result1 = await categories.bulkCreate(all_branch);
            const result1 = await categories.findAll({
               where: {
                  category_list_id: new_category_list_id
               }
            });
            const result = await product.bulkCreate(all_product);
            if (result) {
               // console.log(result)
               res.send({ status: "Success", msg: "Successfully added!", new_category, Products: result, categories: result1 });
            } else {
               res.send({ status: "failure", msg: "Please check sell_id may be already inserted!" });
            }
            // }
         } else {
            const new_category = await category_list.create({
               category_name,
               description,
               card_img
            });
            // console.log(new_category.dataValues.category_list_id)
            var new_category_list_id = new_category.dataValues.category_list_id
            // console.log("new_category_list_id", new_category_list_id)
            console.log(branch_id)
            branch_id = await branch_id.split(',');
            console.log("branch_id", branch_id)
            // console.log(branch_id.map((item) => item))
            const all_branch = await branch.findAll({
               where: {
                  branch_id: branch_id
               },
               raw: true,
               attributes: ["branch_id"]
            });
            // console.log("all_branch", all_branch)
            product_id = await product_id.split(',');
            items_available = await items_available.split(',');
            prices = await prices.split(',');
            var all_product = []
            // console.log("all_branch.length", all_branch.length)
            // console.log("product_all.length", product_all.length)
            for (var i = 0; i < all_branch.length; i++) {
               // console.log("i", i)
               all_branch[i].category_list_id = new_category_list_id;
               var new_cat = await categories.create({
                  branch_id: all_branch[i].branch_id,
                  category_list_id: new_category_list_id
               });
               for (var j = 0; j < product_id.length; j++) {
                  // console.log("j", j)
                  all_product.push({
                     product_list_id: product_id[j],
                     price: parseInt(prices[j]),
                     branch_id: all_branch[i].branch_id,
                     category_id: new_cat.category_id,
                     status: true,
                     items_available: parseInt(items_available[j])
                  })
               }
            }
            // console.log("all_branch", all_branch)
            // console.log("product_all", all_product)
            // const result1 = await categories.bulkCreate(all_branch);
            const result1 = await categories.findAll({
               where: {
                  category_list_id: new_category_list_id
               }
            });
            const result = await product.bulkCreate(all_product);
            if (result) {
               // console.log(result)
               res.send({ status: "Success", msg: "Successfully added!", new_category, Products: result, categories: result1 });
            } else {
               res.send({ status: "failure", msg: "Please check sell_id may be already inserted!" });
            }
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({ "status": "failure", "msg": err });
      }
   }

   // edit product list...working
   async editproductlist(req, res) {
      try {
         console.log(req.body)
         var card_img;
         // console.log(getCurrentFilenames());
         if (req.file) {
            card_img = process.env.url + req.file.filename + req.file.originalname
            console.log(req.file)
            req.body.card_img = card_img;
            var new_name = req.file.path + req.file.originalname
            fs.rename(req.file.path, new_name, () => {
               console.log("\nFile Renamed!\n");
            });
         }
         const update_prod_list = await product_list.update(req.body, { where: { product_list_id: req.body.product_list_id } });
         console.log(update_prod_list);
         if (update_prod_list[0]) {
            res.json({
               status: "success",
               msg: "status updated"
            });
         } else {
            res.json({
               status: "failure",
               msg: "update failed"
            });
         }
      } catch (err) {
         res.json({ "msg": "error2", err })
      }
   }

   // edit category list....working
   async editcategorylist(req, res) {
      try {
         console.log(req.body)
         console.log(req.file)
         var card_img;

         // console.log(getCurrentFilenames());
         if (req.file) {
            card_img = process.env.url + req.file.filename + req.file.originalname
            console.log(req.file)
            req.body.card_img = card_img;
            var new_name = req.file.path + req.file.originalname
            fs.rename(req.file.path, new_name, () => {
               console.log("\nFile Renamed!\n");
            });
         }
         const update_catg = await category_list.update(req.body, { where: { category_list_id: req.body.category_list_id } });
         console.log(update_catg);
         if (update_catg[0]) {
            res.json({
               status: "success",
               msg: "status updated"
            });
         } else {
            res.json({
               status: "failure",
               msg: "update failed"
            });
         }
      } catch (err) {
         res.json({ "msg": "error1", err })
      }
   }


   // Add New food item..working
   async addnewfooditem(req, res) {
      try {
         const { product_name, sku, description, price, prepare_time, product_type, food_type } = req.body;
         let { branch_id, category_id, items_available, add_ons_id, order } = req.body;
         let allids = []
         var status;
         if (req.body.status) {
            if (req.body.status = 'Active') {
               status = true;
            } else {
               status = false;
            }
         } else {
            status = true;
         }
         console.log("status", status)
         var card_img = process.env.url + req.file.filename + req.file.originalname
         console.log(req.file)
         // console.log(getCurrentFilenames());
         var new_name = req.file.path + req.file.originalname
         fs.rename(req.file.path, new_name, () => {
            console.log("\nFile Renamed!\n");

            // List all the filenames after renaming
            // getCurrentFilenames();
         });
         // console.log(req.body)
         console.log(card_img)
         const new_product = await product_list.create({
            product_name,
            sku,
            description,
            price,
            prepare_time,
            product_type,
            food_type,
            card_img,
            status
         });
         console.log(new_product.dataValues.product_list_id)
         var new_product_list_id = new_product.dataValues.product_list_id
         add_ons_id = await add_ons_id.split(',');
         order = await order.split(',');
         var add_on_data = []
         for (var j = 0; j < add_ons_id.length; j++) {
            var obj = {}
            obj.product_list_id = new_product_list_id
            obj.add_ons_id = add_ons_id[j]
            obj.order = order[j]
            add_on_data.push(obj)
         }
         const result1 = await per_product_add_ons.bulkCreate(add_on_data);
         console.log(add_on_data)
         if (branch_id == "All") {
            // console.log(all_branch)
            //   single_nft.profile_pic = "";
            // add to all category
            if (category_id == 'All') {
               const all_categories = await categories.findAll({
                  raw: true,
                  attributes: ["category_id", "branch_id"]
               });
               var all_product = []
               for (var i = 0; i < all_categories.length; i++) {
                  all_product.push({
                     product_list_id: new_product_list_id,
                     price: price,
                     branch_id: all_categories[i].branch_id,
                     category_id: all_categories[i].category_id,
                     status: true,
                     items_available: items_available
                  })
               }
               // console.log("all_branch", all_branch)
               console.log("product_all", all_product)
               // const result1 = await categories.bulkCreate(all_branch);
               const result = await product.bulkCreate(all_product);
               if (result) {
                  // console.log(result)
                  res.send({ status: "Success", msg: "Successfully added!", result });
               } else {
                  res.send({ status: "failure", msg: "Please check sell_id may be already inserted!" });
               }
            } else {
               category_id = await category_id.split(',');
               console.log("category_id", category_id)
               const all_branch = await branch.findAll({
                  raw: true,
                  attributes: ["branch_id"]
               });
               console.log(all_branch)
               const all_categories = await categories.findAll({
                  where: {
                     [Op.and]: [{
                        category_list_id: { [Op.in]: category_id.map((b) => b) },
                     }, {
                        branch_id: { [Op.in]: all_branch.map((b) => b.branch_id) }
                     }
                     ]
                  },
                  raw: true,
                  attributes: ["category_id", "branch_id"]
               });

               // console.log(product_id.map((item) => item))
               var all_product = []
               // console.log("all_branch.length", all_branch.length)
               // console.log("product_all.length", product_all.length)
               for (var i = 0; i < all_categories.length; i++) {
                  all_product.push({
                     product_list_id: new_product_list_id,
                     price: price,
                     branch_id: all_categories[i].branch_id,
                     category_id: all_categories[i].category_id,
                     status: true,
                     items_available: items_available
                  })
               }
               // console.log("all_branch", all_branch)
               console.log("product_all", all_product)
               // const result1 = await categories.bulkCreate(all_branch);
               const result = await product.bulkCreate(all_product);
               if (result) {
                  // console.log(result)
                  res.send({ status: "Success", msg: "Successfully added!", result });
               } else {
                  res.send({ status: "failure", msg: "Please check sell_id may be already inserted!" });
               }
            }
         }
         else {
            branch_id = await branch_id.split(',');
            const all_branch = await branch.findAll({
               where: {
                  branch_id: branch_id
               },
               raw: true,
               attributes: ["branch_id"]
            });
            console.log("all_branch", all_branch)
            // const all_branch = await branch.findAll({
            //    raw: true,
            //    attributes: ["branch_id"]
            // });
            // console.log(all_branch)
            //   single_nft.profile_pic = "";
            if (category_id == 'All') {
               const category_all = await categories.findAll({
                  where: {
                     branch_id: { [Op.in]: all_branch.map((b) => b.branch_id) }
                  },
                  raw: true,
                  attributes: ["category_id", "branch_id"]
               });
               var all_product = []
               for (var i = 0; i < category_all.length; i++) {
                  all_product.push({
                     product_list_id: new_product_list_id,
                     price: price,
                     branch_id: category_all[i].branch_id,
                     category_id: category_all[i].category_id,
                     status: true,
                     items_available: items_available
                  })
               }
               // console.log("all_branch", all_branch)
               console.log("product_all", all_product)
               // const result1 = await categories.bulkCreate(all_branch);
               const result = await product.bulkCreate(all_product);
               if (result) {
                  // console.log(result)
                  res.send({ status: "Success", msg: "Successfully added!", result });
               } else {
                  res.send({ status: "failure", msg: "Please check sell_id may be already inserted!" });
               }
            } else {
               category_id = await category_id.split(',');
               console.log("category_id", category_id)
               // console.log(product_id.map((item) => item))
               const all_categories = await categories.findAll({
                  where: {
                     [Op.and]: [{
                        category_list_id: { [Op.in]: category_id.map((b) => b) },
                     }, {
                        branch_id: { [Op.in]: all_branch.map((b) => b.branch_id) }
                     }
                     ]
                  },
                  raw: true,
                  attributes: ["category_id", "branch_id"]
               });
               // console.log("product_all", product_all)
               var all_product = []
               // console.log("all_branch.length", all_branch.length)
               // console.log("product_all.length", product_all.length)
               for (var i = 0; i < all_categories.length; i++) {
                  all_product.push({
                     product_list_id: new_product_list_id,
                     price: price,
                     branch_id: all_categories[i].branch_id,
                     category_id: all_categories[i].category_id,
                     status: true,
                     items_available: items_available
                  })
               }
               // console.log("all_branch", all_branch)
               console.log("product_all", all_product)
               // const result1 = await categories.bulkCreate(all_branch);
               const result = await product.bulkCreate(all_product);
               if (result) {
                  // console.log(result)
                  res.send({ status: "Success", msg: "Successfully added!", result });
               } else {
                  res.send({ status: "failure", msg: "Please check sell_id may be already inserted!" });
               }
            }
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({ "status": "failure", "msg": err });
      }
   }

   // add product list to branch with its category id..working
   async addproductinbranch(req, res) {
      try {
         const { price, product_list_id, branch_id, items_available, category_id, status } = req.body

         // check is category id is valid
         const check = await categories.findOne({
            where: { category_id: category_id, branch_id: branch_id }
         })

         if (check) {

            const data = await product.create({
               price: price,
               product_list_id: product_list_id,
               branch_id: branch_id,
               items_available: items_available,
               category_id: category_id,
               status: status
            });

            res.json({ status: "success", data })
         } else {
            res.json({ status: "failure", "msg": "no data found for given category id" })
         }

      } catch (err) {
         res.json({ status: "failure", error })
      }
   }

   //show all categories (with branch/without branch)...working
   async getcategories(req, res) {
      const branch_id = req.query.branch_id

      try {
         if (branch_id) {
            // show categories by branch id...
            const data = await categories.findAll({ include: category_list, where: { branch_id }, attributes: { exclude: ["createdAt", "updatedAt"] } });
            res.json({ "status": "success", "data": data });
         }
         else {
            // display categories of all barnces...
            const data = await category_list.findAll();
            res.json({ "status": "success", "data": data });
         }

      } catch (error) {
         res.json({ status: "failure", error })

      }
   }

   // get_add_on_products
   async get_add_on_products(req, res) {
      var add_ons_id = req.query.add_ons_id
      try {
         if (add_ons_id) {
            // show categories by branch id...
            const data = await per_product_add_ons.findAll(
               {
                  where: {
                     add_ons_id
                  },
                  include: {
                     model: product_list
                  }
               }
            );
            if (data.length != 0) {
               res.json({ "status": "success", "data": data });
            } else {
               res.json({ "status": "failure", "msg": "No Product!" });
            }
         }
      } catch (error) {
         res.json({ status: "failure", error })

      }
   }

   // get_product_add_ons
   async get_product_add_ons(req, res) {
      var product_list_id = req.query.product_list_id
      try {
         if (product_list_id) {
            // show categories by branch id...
            const data = await per_product_add_ons.findAll(
               {
                  where: {
                     product_list_id
                  },
                  include: {
                     model: add_ons
                  }
               }
            );
            if (data.length != 0) {
               res.json({ "status": "success", "data": data });
            } else {
               res.json({ "status": "failure", "msg": "No Product!" });
            }
         }
      } catch (error) {
         res.json({ status: "failure", error })

      }
   }

   // getcategorybranches
   async getcategorybranches(req, res) {
      const category_list_id = req.query.category_list_id
      try {
         // show categories by branch id...
         const data = await categories.findAll({
            where: { category_list_id },
            include: branch,
            attributes: { exclude: ["createdAt", "updatedAt"] }
         });
         if (data.length != 0) {
            res.json({ "status": "success", "data": data });

         } else {
            res.json({ "status": "failure" });

         }
      }
      catch (error) {
         res.json({ status: "failure", error })
      }
   }

   // getcategorybybranches
   async getcategorybybranches(req, res) {
      const branch_id = req.query.branch_id
      const category_list_id = req.query.category_list_id
      try {
         if (branch_id) {
            // show categories by branch id...
            const data = await categories.findAll({
               where: { category_list_id, branch_id },
               include: category_list,
               include: {
                  model: product,
                  // include: {
                  //    model: per_product_add_ons,
                  //    separate: true,
                  //    include: {
                  //       model: add_ons,
                  //       include: {
                  //          model: add_on_option
                  //       }
                  //    }
                  // },
                  include: {
                     model: product_list,
                  }
               },
               attributes: { exclude: ["createdAt", "updatedAt"] }
            });
            res.json({ "status": "success", "data": data });
         }
         else {
            // display categories of all barnces...
            const data = await category_list.findAll();
            res.json({ "status": "success", "data": data });
         }

      } catch (error) {
         res.json({ status: "failure", error })

      }
   }
   // show all products with addons (with branch/without branch)..working
   async getproducts(req, res) {
      const branch_id = req.query.branch_id

      try {
         if (branch_id) {
            // show products by branch id...
            const data = await product.findAll({
               where: {
                  // items_available: {
                  //    [Op.gt]: 0
                  // }, 
                  branch_id: branch_id
               },
               include: {
                  model: product_list,
                  include: {
                     model: per_product_add_ons,
                     separate: true,
                     include: {
                        model: add_ons,
                        include: {
                           model: add_on_option
                        }
                     }
                  }
               },
               attributes: { exclude: ["createdAt", "updatedAt"] }
            });
            console.log(data)

            res.json({ "status": "success", "data": data });
         }
         else {
            // display all products
            const data = await product_list.findAll();

            res.json({ "status": "success", "data": data });
         }

      } catch (error) {
         res.json({ status: "failure", error })

      }
   }

   // products under particular category....woring
   async getproductbycategory(req, res) {
      try {
         const category_id = req.query.category;
         const data = await product.findAll({
            where: {
               category_id
            },
            include: {
               model: product_list,
               include: {
                  model: per_product_add_ons,
                  separate: true,
                  include: {
                     model: add_ons,
                     include: {
                        model: add_on_option
                     }
                  }
               }
            },
            attributes: { exclude: ["createdAt", "updatedAt"] }
         });

         if (data.length > 0) {
            res.json({
               status: "success",
               data: data
            });
         }
         else {
            res.json({
               status: "failure",
               msg: "no product found"
            });
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: "no product found"
         });
      }
   }

   // single product details....working
   async getproductdetails(req, res) {
      try {
         const product_list_id = req.query.product_list_id;
         const data = await product_list.findOne({
            where: {
               product_list_id,
            },
            include: {
               model: per_product_add_ons,
               separate: true,
               include: {
                  model: add_ons,
                  include: {
                     model: add_on_option
                  }
               }
            },
            attributes: { exclude: ["createdAt", "updatedAt"] }
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
               msg: "no product found"
            });
         }
      }
      catch (err) {
         console.log(err);
         res.status(500).json({
            status: "failure",
            msg: "no product found"
         });
      }
   }

   // add addons..working
   async add_addons(req, res) {
      try {
         const { title, add_on_options } = req.body;
         var add_on_type;
         if (req.body.add_on_type) {
            add_on_type = req.body.add_on_type
         } else {
            add_on_type = "radio";
         }
         const new_addon = await add_ons.create({ title, add_on_type });
         // console.log(new_addon)
         var add_ons_id = new_addon.dataValues.add_ons_id
         console.log(add_ons_id)
         for (var i = 0; i < add_on_options.length; i++) {
            console.log(i)
            add_on_options[i].add_ons_id = add_ons_id
         }
         console.log(add_on_options)
         const result = await add_on_option.bulkCreate(add_on_options);
         if (result) {
            // console.log(result)
            res.send({ status: "Success", msg: "Successfully added!", result });
         } else {
            res.send({ status: "failure", msg: "Please check data may be already inserted!" });
         }
      }
      catch (err) {
         console.log(err)
         res.json({ "status": "failure", "msg": err });
      }
   }

   // add_product_addons
   async add_product_addons(req, res) {
      try {
         const { product_list_id, add_ons_id } = req.body;
         const result = await per_product_add_ons.findOne(
            {
               where: {
                  product_list_id,
                  add_ons_id
               }
            })
         if (result) {
            res.json({ "status": "failure", "msg": "Already Added!" });
         } else {
            const data = await per_product_add_ons.create({
               product_list_id,
               add_ons_id
            })
            res.json({ "status": "success", data })
         }

      }
      catch (err) {
         console.log(err)
         res.json({ "status": "failure", "msg": err });
      }
   }


   // add_addons_option
   async add_addons_option(req, res) {
      try {
         const { add_on_options, add_ons_id } = req.body;
         // console.log(add_ons_id)
         for (var i = 0; i < add_on_options.length; i++) {
            console.log(i)
            add_on_options[i].add_ons_id = add_ons_id
         }
         console.log(add_on_options)
         const result = await add_on_option.bulkCreate(add_on_options);
         if (result) {
            // console.log(result)
            res.send({ status: "Success", msg: "Successfully added!", result });
         } else {
            res.send({ status: "failure", msg: "Please check data!" });
         }
      }
      catch (err) {
         console.log(err)
         res.json({ "status": "failure", "msg": err });
      }
   }


   // upd_addons
   async upd_addons(req, res) {
      try {
         const { title, add_on_options, add_ons_id } = req.body;
         var add_on_type;
         if (req.body.add_on_type) {
            add_on_type = req.body.add_on_type
         } else {
            add_on_type = "radio";
         }
         const upd_addon = await add_ons.update({ title, add_on_type }, {
            where: {
               add_ons_id
            }
         });
         for (var i = 0; i < add_on_options.length; i++) {
            const upd_addon_opt = await add_on_option.update(
               {
                  title: add_on_options[i].title,
                  price: add_on_options[i].price,
                  sku: add_on_options[i].sku,
                  order: add_on_options[i].order
               }
               , {
                  where: {
                     add_on_option_id: add_on_options[i].add_on_option_id
                  }
               });
         }
         if (upd_addon) {
            res.send({ status: "Success", msg: "Successfully updated!" });
         } else {
            res.send({ status: "Failure" });
         }
      }
      catch (err) {
         console.log(err)
         res.json({ "status": "failure", "msg": err });
      }
   }

   // get addons available....working
   async getaddons(req, res) {
      try {
         const data = await add_ons.findAll()
         res.json({ "msg": "success", data })
      } catch (err) {
         res.json({ "msg": "error", err })
      }
   }
   // getsingleaddons
   async getsingleaddons(req, res) {
      try {
         var add_ons_id = req.query.add_ons_id
         const data = await add_ons.findOne({
            where: {
               add_ons_id
            },
            include: {
               model: add_on_option
            }
         })
         if (data) {
            res.json({ "msg": "success", data })
         } else {
            res.json({ "msg": "failure" })
         }
      } catch (err) {
         res.json({ "msg": "error", err })
      }
   }

   // delsingleaddons
   async delsingleaddons(req, res) {
      try {
         var add_ons_id = req.query.add_ons_id
         const data = await add_ons.destroy({
            where: {
               add_ons_id
            }
         })
         const data2 = await add_on_option.destroy({
            where: {
               add_ons_id
            }
         })
         const data3 = await add_on_option.destroy({
            where: {
               add_ons_id
            }
         })
         const data4 = await per_product_add_ons.destroy({
            where: {
               add_ons_id
            }
         })
         if (data) {
            res.json({ "msg": "success", data })
         } else {
            res.json({ "msg": "failure" })
         }
      } catch (err) {
         res.json({ "msg": "error", err })
      }
   }

   // deladdonsoption
   async deladdonsoption(req, res) {
      try {
         var add_on_option_id = req.query.add_on_option_id
         const data = await add_on_option.destroy({
            where: {
               add_on_option_id
            }
         })
         if (data) {
            res.json({ "msg": "success", data })
         } else {
            res.json({ "msg": "failure" })
         }
      } catch (err) {
         res.json({ "msg": "error", err })
      }
   }

   // edititemavailable
   async edititemavailable(req, res) {
      try {
         // console.log(req.body)
         const update_item_available = await product.update(req.body,
            {
               where:
                  { product_id: req.body.product_id }
            });
         console.log(update_item_available);
         if (update_item_available[0]) {
            res.json({
               status: "success",
               msg: "status updated"
            });
         } else {
            res.json({
               status: "failure",
               msg: "update failed"
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

   // edit  category...this will be by branch..working
   async editcategory(req, res) {
      try {
         const { category_id, category_list_id, branch_id } = req.body
         const data = await categories.findOne({
            where: { category_id }
         })

         data.set({
            category_list_id: category_list_id,
            branch_id: branch_id
         })
         await data.save()

         res.json({ "msg": "success", data })


      } catch (err) {
         res.json({ "msg": "error", err })
      }
   }

   // edit product..edit product by branch....working
   async editproduct(req, res) {
      try {
         const { product_id, product_list_id, branch_id, category_id, status, price, items_available } = req.body
         const data = await product.findOne({
            where: { product_id }
         })

         data.set({
            product_list_id: product_list_id,
            branch_id: branch_id,
            category_id: category_id,
            status: status,
            price: price,
            items_available: items_available
         })
         await data.save()

         res.json({ "msg11": "success", data })


      } catch (err) {
         res.json({ "msg": "error", err })
      }
   }

   // edit add ons...working
   async editaddon(req, res) {
      try {
         const { add_ons_id, title } = req.body
         const data = await add_ons.findOne({
            where: { add_ons_id }
         })
         data.set({
            title: title
         })
         await data.save()

         res.json({ "msg": "success", data })


      } catch (err) {
         res.json({ "msg": "error", err })
      }
   }

   // addaddonproduct
   async addaddonproduct(req, res) {
      try {
         const { product_list_id, add_ons_id } = req.body
         const result = await per_product_add_ons.findOne({
            where: {
               product_list_id,
               add_ons_id
            }
         })
         if (result) {
            res.json({ "status": "failure", "msg": "Already Added!" })
         } else {
            const data = await per_product_add_ons.create({
               product_list_id,
               add_ons_id
            })
            res.json({ "status": "success", data })
         }
      } catch (err) {
         console.log(err)
         res.json({ "msg": "error", err })
      }
   }


   // edit any addon option..working...
   async editaddonoption(req, res) {
      try {
         const { add_on_option_id, add_ons_id, title, price, sku, order } = req.body
         const data = await add_on_option.findOne({
            where: { add_on_option_id }
         })

         data.set({
            add_ons_id: add_ons_id,
            title: title,
            price: price,
            sku: sku,
            order: order
         })
         await data.save()

         res.json({ "msg": "success", data })


      } catch (err) {
         res.json({ "msg": "error", err })
      }
   }

   // edit_product_addon_order

   async edit_product_addon_order(req, res) {
      try {
         const { data } = req.body
         for (var i = 0; i < data.length; i++) {
            const update_prod_list = await per_product_add_ons.update({
               order: data[i].order
            }, { where: { per_product_add_ons_id: data[i].per_product_add_ons_id } });
            console.log(update_prod_list);
         }
         res.json({ "msg": "success", data })


      } catch (err) {
         res.json({ "msg": "error", err })
      }
   }

   //delete product branchwise....working
   async deleteproductbranchwise(req, res) {
      try {

         const { branch_id, product_list_id } = req.body

         let list_of_product_ids = []
         if (Array.isArray(product_list_id)) {
            list_of_product_ids = product_list_id
         } else {
            if (product_list_id == "All") {
               const data = await product_list.findAll()
               for (var j = 0; j < data.length; j++) {
                  list_of_product_ids.push(data[j].dataValues['product_list_id'])
               }
               //res.json({list_of_product_ids})
            }
            else {
               list_of_product_ids.push(product_list_id)
            }

         }

         for (var i = 0; i < list_of_product_ids.length; i++) {
            product.destroy({
               where: { product_list_id: list_of_product_ids[i], branch_id }
            })

         }

         res.json({ "msg": "success" })

      } catch (err) {
         res.json({ "msg": "error", err })
      }
   }

   // branchwise delete category...working
   async deletecategorybranchwise(req, res) {
      try {

         const { branch_id, category_list_id } = req.body
         // 1 branch id and 5 categorylist ids....
         let list_of_category_ids = []

         if (Array.isArray(category_list_id)) {
            list_of_category_ids = category_list_id
         } else {
            list_of_category_ids.push(category_list_id)
         }



         for (var i = 0; i < list_of_category_ids.length; i++) {
            categories.destroy({
               where: { branch_id, category_list_id: list_of_category_ids[i] }
            })
         }


         res.json({ "msg": "success" })

      } catch (err) {
         res.json({ "msg": "error", err })
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
         console.log(data)
         if (data) {
            res.json({
               status: "success",
               msg: "Product deleted successfully!"
            });
         } else {
            res.json({
               status: "failure",
               msg: "Product Not Found!"
            });
         }
      } catch (err) {
         res.json({ "status": "failure", err })
      }
   }

   //delete category list....working
   async deletecategorylist(req, res) {
      try {
         const id = req.query.id
         const data = await category_list.findOne({
            where: { category_list_id: id }
         })
         if (data) {
            const clid = data.category_list_id
            const data4 = await category_list.destroy({
               where: { category_list_id: clid }
            })
            console.log("data4", data4)
            const data1 = await categories.findAll({
               where: { category_list_id: id }
            })
            if (data1.length != 0) {
               for (var i = 0; i < data1.length; i++) {
                  const data2 = await product.destroy({
                     where: { category_id: data1[i].category_id }
                  })
                  console.log("data2", data2)
               }
            }
            const data3 = await categories.destroy({
               where: { category_list_id: clid }
            })
            console.log("data3", data3)
            res.json({ "msg": "deleted", data })
         } else {
            res.json({ "msg": "failure", "err": "no data found" })
         }


      } catch (err) {
         res.json({ "msg": "error", err })
      }
   }

   //delete product list...working
   async deleteproductlist(req, res) {
      try {
         const id = req.query.id
         const data = await product_list.findOne({
            where: { product_list_id: id }
         })
         if (data) {
            const clid = data.product_list_id
            const data4 = await product_list.destroy({
               where: { product_list_id: clid }
            })
            console.log("data4", data4)
            const data1 = await product.destroy({
               where: { product_list_id: id }
            })
            console.log("data1", data1)
            const data2 = await per_product_add_ons.destroy({
               where: { product_list_id: id }
            })
            console.log("data2", data2)
            res.json({ "msg": "deleted", data })
         } else {
            res.json({ "msg": "failure", "err": "no data found" })
         }
      } catch (err) {
         res.json({ "msg": "error", err })
      }
   }

   // delete any addon like size, milk....working
   async deleteaddon(req, res) {
      try {
         const id = req.query.id
         const data = await add_ons.findOne({
            where: { add_ons_id: id }
         })

         if (data) {
            const addonid = data.add_ons_id

            add_ons.destroy({
               where: { add_ons_id: addonid }
            })

            add_on_option.destroy({
               where: { add_ons_id: addonid }
            })

            per_product_add_ons.destroy({
               where: { add_ons_id: addonid }
            })


            res.json({ "msg": "deleted", data })
         } else {
            res.json({ "msg": "failure", "err": "no data found" })
         }


      } catch (err) {
         res.json({ "msg": "error", err })
      }
   }

   // delete addons option like small medium large..working
   async deleteaddonsoption(req, res) {
      try {
         const id = req.query.id
         const data = await add_on_option.findOne({
            where: { add_on_option_id: id }
         })

         if (data) {
            const addonoptionid = data.add_on_option_id

            add_on_option.destroy({
               where: { add_on_option_id: addonoptionid }
            })

            res.json({ "msg": "deleted", data })
         } else {
            res.json({ "msg": "failure", "err": "no data found" })
         }


      } catch (err) {
         res.json({ "msg": "error", err })
      }
   }

   // delete addons for any product...working
   async deleteaddonforproduct(req, res) {
      try {
         const per_product_add_ons_id = req.query.per_product_add_ons_id
         const data = await per_product_add_ons.findOne({
            where: { per_product_add_ons_id }
         })
         if (data) {
            data.destroy()
            res.json({ "msg": "deleted", data })
         } else {
            res.json({ "msg": "failure", "err": "no data found" })
         }

      } catch (err) {
         res.json({ "msg": "error", err })
      }
   }



}

module.exports = new adminProductController();