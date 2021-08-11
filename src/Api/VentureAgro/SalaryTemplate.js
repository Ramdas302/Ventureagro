const express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
var  ProductSchema= require("../../../app/models/Product");
var ProductModel = mongoose.model("Product");
const path = require("path");
var fs = require("fs");

router.post('/addSalary',function(req,res){
    var addSalary = new ProductModel({
        userId:req.body.username,
        Sales_Target:req.body.Sales_Target,
        Salary:req.body.Salary,
    });
    addSalary.save(function (err, result) {
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


  router.get('/getsalary',function(req,res){
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
  
router.put('/updatesalary/:id',function(req,res){
    update = {
      $set: {
        userId:req.body.username,
        Sales_Target:req.body.Sales_Target,
        Salary:req.body.Salary,
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
