var mongoose = require('mongoose');

url = 'mongodb+srv://Dataversity:dataversity123@cluster0.ft1px.mongodb.net/mernstack?retryWrites=true&w=majority'
mongoose.connect(url,{
useNewUrlParser:true,
useCreateIndex:true,
useUnifiedTopology:true,
useFindAndModify:false
}).then(()=>{
console.log('mongodb connected')
}).catch((err)=>{
    console.log('mongodb not connected')
})

module.exports=mongoose;