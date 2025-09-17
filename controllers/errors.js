const user = require("../models/user");

exports.pageNotFound=(req,res,next)=>{
  res.status(404).render('404',{pagetittle:'Page not found',
    isLoggedIn:req.isLoggedIn,
    user: req.session.user
  });
}