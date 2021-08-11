var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ProductSchema = new mongoose.Schema({
  Product_Name:{type: String, required: true},
  Established_year:{type: String, required: true},
  Price:{type: String, required:true},
  Ready_To_Launch:{type: String, required: true}, 
});
 mongoose.model('Product', ProductSchema);