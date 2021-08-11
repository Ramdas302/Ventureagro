const express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
var  ProductSchema= require("../../../app/models/Product");
var ProductModel = mongoose.model("Product");
const path = require("path");
var fs = require("fs");

router.post('/addProduct',function(req,res){
    var addProduct = new ProductModel({
        Product_Name:req.body.Product_Name,
        Established_year:req.body.Established_year,
        Price:req.body.Price,
        Ready_To_Launch:req.body.Ready_To_Launch
    });
    addProduct.save(function (err, result) {
      if (err) {
        console.error(err);
        return res.status(400).json({
          message: 'Bad Request'
        });
      } else {
        res.json({
          status: 200,
          data: result
        })
      }

    });

});


  router.get('/getallProduct',function(req,res){
    ProductModel.find({}).exec(function(err,result){
        if(err){
          return res.status(400).json({
            message: 'Bad Request'
          });
        }else{
          res.json({
            status: 200,
            data: result
          });
        }
      
      });
  });
  

router.put('/updateProduct/:id',function(req,res){
    update = {
      $set: {
        Product_Name:req.body.Product_Name,
        Established_year:req.body.Established_year,
        Price:req.body.Price,
        Ready_To_Launch:req.body.Ready_To_Launch
      }
    };
    ProductModel.findByIdAndUpdate(req.params.id,update, function (err, result) {
        if (err) {
          console.error("err"+err)
          return res.status(400).json({
            message: 'Bad Request'
          });
        } else {
          res.json({
            status: 200,
            data: result
          })
        }
  
      });
  
  
  });
  
  
    router.post('/deleteProduct/:id',async(req,res)=>{
        var deletedata = await ProductModel.findByIdAndRemove(req.params.id)
        if (deletedata) {
          res.json({
            status:200,
            data:deletedata 
          })
        }else{
         console.error(err);
         return res.status(400).json({
           message: 'Bad Request'
        }); 
        }
      })
module.exports = router;
