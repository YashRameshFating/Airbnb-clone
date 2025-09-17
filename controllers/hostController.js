const fs=require('fs');
const Home = require("../models/home");



exports.getAddHome=(req,res,next)=>{
    res.render('host/edit-home',{pagetittle:'add home to airbnb',currentPage: "addhome",editing:false,
    isLoggedIn:req.isLoggedIn,
    user: req.session.user
    });
}

exports.getEditHome=(req,res,next)=>{
    const homeId=req.params.homeId;
    const editing=req.query.editing==='true';
     Home.findById(homeId).then(home => {
          if(!home){
          console.log("Home not found for editing.");
          return res.redirect("/host/host-home-list");
          }
          console.log(homeId,editing,home);
            res.render('host/edit-home',{
              home:home,
              pagetittle:'Edit your Home',currentPage: "addhome",
              editing:editing,
             isLoggedIn:req.isLoggedIn,
             user: req.session.user
          });
   })
  
}

exports.getHostHomes=(req,res,next)=>{
  Home.find().then(registeredHomes=>{
      res.render('host/host-home-list',{registeredHomes :registeredHomes,pagetittle:'Host Home List',
      isLoggedIn:req.isLoggedIn,
      user: req.session.user
      });
  });
}
 

exports.postAddHome=(req,res,next)=>{
  const {houseName,price,location,rating ,description}=req.body;
  console.log(houseName,price,location,rating,description);
   console.log(req.file);
   if(!req.file){
    console.log("No file uploaded");
    return res.redirect("/host/add-home");
   }
   const photo=req.file.path; // Get the file path from multer
   console.log("Photo path:", photo);
  const home=new Home({houseName,price,location,rating,photo,description});
   home.save().then(()=>{
    console.log('Home Saved successfully');
  });
  res.redirect("/host/host-home-list");
}

 
exports.postEditHome=(req,res,next)=>{
  
  const {houseName,price,location,rating,description,id}=req.body;

   Home.findById(id).then((home)=>{
      home.houseName=houseName;
      home.price=price;
      home.location=location;
      home.rating=rating;
      home.description=description;
      if(req.file){
        fs.unlink(home.photo, (err) => {
          if (err) {    
            console.error("Error deleting old photo:", err);
          }
        });
        console.log("New file uploaded:", req.file.path);
        home.photo=req.file.path; // Update the photo path if a new file is uploaded
      }
       console.log("Home Updated",home);
      home.save().then(result=>{
       console.log("Home Updated",result);
       }).catch(err=>{
        console.log("Error While Updating",err);
       })
       res.redirect("/host/host-home-list");
   }).catch(err=>{
       console.log("Error While finding the home");
   });
}

exports.postDeleteHome=(req,res,next)=>{
  const homeId=req.params.homeId;
  console.log("came to delete",homeId);
  Home.findByIdAndDelete(homeId).then(()=>{
        res.redirect("/host/host-home-list");
  }).catch((error)=>{
    console.log("Error while deleting",error);
  })
  
};