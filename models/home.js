
const mongoose=require('mongoose');
const favourite = require('./favourite');


const homeSchema=mongoose.Schema({
   
   houseName: {
      type:String,
      requried:true
   },
     price: {
      type:Number,
      requried:true
   },
      location:{
      type:String,
      requried:true
   },
      rating:{
      type:Number,
      requried:true
   },
   photo:String,
   description:String,

});
homeSchema.pre('findOneAndDelete',async function(next) {
   console.log("Came to pre hook while deleting a home");
   const homeId=this.getQuery()._id;
   await favourite.deleteMany({houseId:homeId});
   next();
});

module.exports=mongoose.model('Home',homeSchema);