
const Favourite = require("../models/favourite");
const Home = require("../models/home");

exports.getIndex=(req,res,next)=>{
  console.log("session is",req.session);
  Home.find().then(registeredHomes=>{
     res.render('store/index',{registeredHomes :registeredHomes,pagetittle:'airbnb Home',
    isLoggedIn:req.isLoggedIn,
    user: req.session.user});
  });
}  
 
exports.getHomes=(req,res,next)=>{
  Home.find().then(registeredHomes=>{
       res.render('store/home-list',{registeredHomes :registeredHomes,pagetittle:'Home List',
    isLoggedIn:req.isLoggedIn,
    user: req.session.user});
  });
}

 
exports.getHomeDetails=(req,res,next)=>{
  const homeId=req.params.homeId;
  console.log("At home detail page",homeId);
  Home.findById(homeId).then(home => {
    if(!home){
      console.log("Home not found");
      res.redirect("/homes");
    }else{
        res.render('store/home-detail',{home:home,pagetittle:'Home Details',
    isLoggedIn:req.isLoggedIn,
    user: req.session.user});
    }
  
  })

}
 
 
exports.getFavouriteList=(req,res,next)=>{

Favourite.find()
 .populate('houseId')
 .then(favourites=>{
  const favouriteHomes=favourites.map((fav)=>fav.houseId);
  res.render('store/favourite-list',{favouriteHomes:favouriteHomes,pagetittle:'My Favourite List',
    isLoggedIn:req.isLoggedIn,
    user: req.session.user});
     });
  };

exports.postAddToFavourite=(req,res,next)=>{
  const homeId=req.body.id;
  Favourite.findOne({houseId:homeId}).then((fav)=>{
    if(fav){
     console.log("Already marked as favourtie");
    }else{
      fav=new Favourite({houseId:homeId});
      fav.save().then((res)=>{
        console.log("Fav added : ",res)
      });
    }
    res.redirect("/favourite-list");
  }).catch(err=>{
     console.log("Error while marking favourites");
  });
}

exports.postRemoveFormFavourite=(req,res,next)=>{
  const homeId=req.params.homeId;
  Favourite.findOneAndDelete({houseId:homeId}).then(result=>{
    console.log("Fav removed: ",result);
  }).catch(err=>{
     console.log("Error while removing favourites: ",err);
  }).finally(()=>{
     res.redirect("/favourite-list");
  })
}

exports.getBooking=(req,res,next)=>{
 res.render('store/booking',{pagetittle:'My Bookings',
  isLoggedIn:req.isLoggedIn,
    user: req.session.user});
}

