const { json } = require("body-parser");
const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) =>{
    Category.findById(id).exec((err, cate)=>{
        if(err){
            return res.status(400).json({
                error:" Category not found in DB"
            });
        }
        req.category = cate;
        next();
    });
};
exports.createCategory=(req, res)=>{
    const category = new  Category(req.body);
    category.save((err,category)=>{
        if(err){
            return res.status(400).json({
                error:"NOT able to save category in DB"
            });
        }
        res.json({category});
    });
};

exports.getCategory =(req, res)=>{
    return res.json(req.category); //req.category populating from getCategoryById middelware
};

exports.getAllCategory=(req, res)=>{
    Category.find().exec((err, items)=>{ //categories or items
        if(err){
            return res.status(400).json({
                error:"NOT categories found"
            });
        }
        res.json({items});//categories or items
    })
}

exports.updateCategory=(req, res)=>{
    const category=req.category;
    category.name = req.body.name;

    category.save((err, updatedCategory)=>{
        if(err){
            return res.status(400).json({
                error:"Failed to update category"
            });
        }
        res.json(updatedCategory);
    });
 }
 exports.removeCategory=(req, res)=>{
     const category= req.category;
     category.remove((err, category)=>{
        if(err){
            return res.status(400).json({
                error:"Failed to delete this  category"
            });
        }
        res.json({
            message:`Category : ${category} is Successfully deleted`
        }); 
     });
 }