const Product = require("../models/product");
const formidable = require("formidable");
const id=require("../models/product")
const _ = require("lodash"); //helps in working with objects and creating new object and array
const fs = require("fs");

exports.getProductById=(req, res)=>{
    Product.findById(id)
    .populate("category")
    .exec((err, product)=>{
        if(err){
            return res.status(400).json({
                error: "Product not found"
            });
        }
        req.product=product;
        next();
    });
}
exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
  
    form.parse(req, (err, fields, file) => {
      if (err) {
        return res.status(400).json({
          error: "problem with image"
        });
      }
      // destructure the fields
      const {name, description,price, category, stock}=fields;
      if(!name|| !description|| !price || !category || !stock){
        return res.status(400).json({
            error:"Please include all fields"
        });
      }
      
      let product = new Product(fields);
  
      //handle file here
      if (file.photo) {
        if (file.photo.size > 3000000) {
          return res.status(400).json({
            error: "File size too big!"
          });
        }
        product.photo.data = fs.readFileSync(file.photo.path);
        product.photo.contentType = file.photo.type;
      }
  
      //save to the DB
      product.save((err, product) => {
        if (err) {
          res.status(400).json({
            error: "Saving tshirt in DB failed"
          });
        }
        res.json(product);
      });
    });
  };

  exports.getProduct=(req, res)=>{
    req.product.photo=undefined; //section 10.7
    return res.json(req.product); 
  };
//middleware
  exports.photo = (req, res, next)=>{
    if(req.product.photo.data){
      res.set("Cotent-Type", req.product.photo.contentType);
      return res.send(req.product.photo.data);
    }
    next();
  }

  exports.deleteProduct=(req, res)=>{
    let product = req.product;
    product.deleteOne((err, deletedProduct)=>{
      if(err){
        return res.status(400).json({
          error:"Failed to delete the product"
        });
      }
      res.json({
        message:"Deletion was a success",
        deletedProduct
      });
    })
  }

  exports.updateProduct=(req, res)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
  
    form.parse(req, (err, fields, file) => {
      if (err) {
        return res.status(400).json({
          error: "problem with image"
        });
      }
      //updation code
      let product = req.product;
      product=_.extend(product, fields);    //extend() takes the value that are there in object and extend that means all the updated values get involves
      //handle file here
      if (file.photo) {
        if (file.photo.size > 3000000) {
          return res.status(400).json({
            error: "File size too big!"
          });
        }
        product.photo.data = fs.readFileSync(file.photo.path);
        product.photo.contentType = file.photo.type;
      }
  
      //save to the DB
      product.save((err, product) => {
        if (err) {
          res.status(400).json({
            error: "Updation of Product failed"
          });
        }
        res.json(product);
      });
    });
  }

  //listing products
// select("-photo") use to avoid selecting photo if select photo also it will take more time to load all product
  exports.getAllProducts = (req, res)=>{
    //geting limit and sortBy from user if user not mention it will be done by defaulte as metion 8 and _id
    let limit =req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    Product.find()
    .select("-photo") 
    .sort([[sortBy, "asc"]])
    .populate("category")
    .limit(limit)
    .exec((err, products)=>{
      if(err){
        return res.status(400).json({
          error:"NO product found"
        });
      }
      res.json(products);
    });
  };

  exports.getAllUniqueCategories =(req, res)=>{
    Product.distinct("category",{},(err, category)=>{
      if(err){
        return res.status(400).json({
          error:"No category found"
        })
      }
      res.json(category);
    })
  }
  exports.updateStock=(req, res, next)=>{
    let myOperations =req.body.order.products.map(prod =>{
      return {
        updateOne:{
          filter:{_id:prod._id},
          update:{$inc: {stock: -prod.count, sold: +prod.count}}
        }
      }
    })
    //read bulkwrite from docs
    Product.bulkWrite(myOperations,{},(err, products)=>{
      if(err){
        return res.status(400).json({
          error:"Bulk operations faild"
        })
      }
      next();
    });
  }