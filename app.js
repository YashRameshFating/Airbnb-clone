//core module
const path=require('path');
const multer = require('multer');
const DB_PATH="mongodb+srv://YashFating:Yash%40123@completecoding0.2ectl0t.mongodb.net/airbnb?retryWrites=true&w=majority&appName=CompleteCoding";

//external  module
const express = require('express');
const session=require('express-session');
const MongoDBStore=require("connect-mongodb-session")(session);
const cookieParser = require("cookie-parser");
const storeRouter=require('./routes/storeRouter');
const authRouter=require('./routes/authRouter');
const hostRouter=require('./routes/hostRouter');
const rootdir=require("./utils/pathutils");
const errorsController=require("./controllers/errors"); 

const { default: mongoose, Collection } = require('mongoose');
const app=express();

app.set('view engine','ejs');
app.set('views','views');

const store=new MongoDBStore({
  uri:DB_PATH,
  collection:'sessions'
})
const storage=multer.diskStorage({
  destination: (req, file, cb) =>{ 
    cb(null, 'uploads/');
  }
  ,
  filename: (req, file, cb)=> {
    cb(null, Date.now() + '-' + file.originalname); // Append timestamp to avoid
  }
}); 
const fileFilter=(req,file,cb)=>{
  if(file.mimetype==='image/png' || file.mimetype==='image/jpg' || file.mimetype==='image/jpeg'){
    cb(null,true);  }
  else{
    cb(null,false);
  }
};

const multerOptions={
  storage,fileFilter, 
};

app.use(express.urlencoded());
app.use(multer(multerOptions).single('photo')); 
app.use(express.static(path.join(rootdir,'public')));
app.use("/uploads",express.static(path.join(rootdir,'uploads')));
app.use("/host/uploads",express.static(path.join(rootdir,'uploads')));
app.use(session({
   secret: "Yash Fating",
   resave:false,
   saveUninitialized: true,
   store:store
}));

app.use(cookieParser());
app.use((req,res,next)=>{
  req.isLoggedIn=req.session.isLoggedIn;
  next();
})

app.use(authRouter);
app.use(storeRouter);
app.use("/host",(req,res,next)=>{
  console.log("isLoggedIn:", req.isLoggedIn); 
   if(req.isLoggedIn){
    next();
   }else{
     res.redirect("/login");
   }
});

  app.use("/host",hostRouter);
  app.use(errorsController.pageNotFound);


  const port=3014;

  mongoose.connect(DB_PATH).then(()=>{
  console.log("Connecting to mongoose : ");
  app.listen(port,()=>{
  console.log(`server running on http://localhost:${port}`);
   });
 }).catch(err=>{
  console.log("Error while connecting to mongo ",err);
 })


