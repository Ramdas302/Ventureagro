const express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
var passport = require("passport");
var userSchema = require("../../../../app/models/Users");
var UserModel = mongoose.model("user");
var ExLoginUserSchema = require("../../../../app/models/Exloginuser");
var ExLoginUserModel = mongoose.model("Exloginuser");
var ExLogoutUserSchema = require("../../../../app/models/Exlogoutuser");
var ExLogoutUserModel = mongoose.model("Exlogoutuser");
var InLoginoutUserSchema = require("../../../../app/models/Inloginoutuser");
var InloginoutuserModel = mongoose.model("Inloginoutuser");
var jwt = require("jsonwebtoken");
var fs = require("fs");
const csv=require('csvtojson')
const multer = require('multer');
const path = require("path");

let upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      let type = req.params.type;
      let path = `./uploads`;
      callback(null, path);
    },
    filename: (req, file, callback) => {
      callback(null, file.originalname,file.fieldname);
    }
  })
});


 router.post('/uploadcsv', upload.single("uploadcsv"), (req, res) =>{
  importCsvData2MongoDB('./uploads/' + req.file.filename);
  res.json({
      'msg': 'File uploaded/import succesfully!', 'file': req.file
  });
});

function importCsvData2MongoDB(filePath){
  csv()
      .fromFile(filePath)
      .then((jsonObj)=>{
          UserModel.insertMany(jsonObj, (err, res) => {
                 if (err) throw err; 
              });
    
          fs.unlinkSync(filePath);
      })
}


router.post('/sign-up', function(req, res) {
  UserModel.register(new UserModel({ username: req.body.username,Email:req.body.Email,Employee_Type:req.body.Employee_Type,Phone_No:req.body.Phone_No}),
    req.body.password, function(err, account) {
    if (err) {
      return res.status(500).json({
        err: err
      });
    }
    passport.authenticate('local')(req, res, function () {
      return res.status(200).json({
        status: 'Registration successful!'
      });
    });
  });
});

router.post("/login", (req, res) => {
  passport.authenticate("local", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).send({
        error: err ? err.message : "Login or password is wrong",
      });
    }
    req.login(user, { session: false }, (error) => {
      if (error) {
        res.send(error);
      }
      var localtime= Date().toString();
      var query = {
        username: req.body.username
    };
    var update = {
      Last_Login:localtime
    };
    var options = {
        new: true
    };
    UserModel.findOneAndUpdate(query, update, options, function(err, user) {
        if (err) {
            console.log(err);
        }
    });

   var savedata = new ExLoginUserModel({
    username: user.username,
    userId: user._id,
     Login_Time:localtime,
   })

   savedata.save(function(err,result){
     if(err){
console.log(err)
     }else{
  console.log(result)
     }
   })

      let token = jwt.sign(
        {
          Email_ID: user.Email_ID,
          username: user.username,
          userId: user._id,
          role: user.role,
        },
        "authorize",
        {
          expiresIn: "1h",
        }
      );
      return res.send({ user, token });
    });
  })(req, res);
});


router.post('/logout', function(req, res) {
  req.logout();
  var localtime= Date().toString();
  var savedata = new ExLogoutUserModel({
    username: req.body.username,
    userId: req.body.UserId,
    Logout_Time:localtime,
   })

   savedata.save(function(err,result){
     if(err){
console.log(err)
     }else{
  console.log(result)
     }
   })
  res.status(200).json({
    status: 'Bye!'
  });
});


  
 
router.get('/getUsers',function(req,res){
  UserModel.find({}).exec(function(err,result){
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

router.put('/updateuser/:id',function(req,res){
  update = {
    $set: {
      username:req.body.username,
      Email:req.body.Email,
      Phone_No:req.body.Phone_No
    }
  };
  UserModel.findByIdAndUpdate(req.params.id,update, function (err, Users) {
      if (err) {
        console.error("err"+err)
        return res.status(400).json({
          message: 'Bad Request'
        });
      } else {
        res.json({
          status: 200,
          data: Users
        })
      }

    });
});


router.post('/deleteUsers/:id',async(req,res)=>{
  var deletedata = await UserModel.findByIdAndRemove(req.params.id)
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


router.post('/InternalAttendance',function(req,res){
    var addInterAttendance = new InloginoutuserModel({
        userId:req.body.username,
        Login_Time:req.body.Login_Time,
        date:req.body.date
    });
    addInterAttendance.save(function (err, result) {
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

router.put('/updatelogout/:id',function(req,res){
  update = {
    $set: {
      userId:req.body.username,
      Login_Time:req.body.Login_Time,
      date:req.body.date,
      Logout_Time:req.body.Logout_Time
    }
  };
  InloginoutuserModel.findByIdAndUpdate(req.params.id,update, function (err, Users) {
      if (err) {
        console.error("err"+err)
        return res.status(400).json({
          message: 'Bad Request'
        });
      } else {
        res.json({
          status: 200,
          data: Users
        })
      }

    });
});

module.exports = router;
