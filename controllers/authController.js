const { check, validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');




exports.getLogin=(req,res,next)=>{
   res.render('auth/login', { pagetittle: 'Login Page' ,
    isLoggedIn: false,
     errors: [],
    oldInput: { email: '' },
    user:{ }
   });

}

exports.postLogin=async (req,res,next)=>{
 const {email,password}=req.body;
 const user =await User.findOne({email:email});
  if(!user){
    return res.status(422).render("auth/login",{
      pagetittle:"Login",
      isLoggedIn:false,
      errors:["Invalid email or password"],
      oldInput:{email},
      user:{}
    });
  }
  const isMatch=await bcrypt.compare(password,user.password);
  if(!isMatch){
    return res.status(422).render("auth/login",{
      pagetittle:"Login",
      isLoggedIn:false,
      errors:["Invalid password"],
      oldInput:{email},
      user:{}
    });
  }
  req.session.isLoggedIn=true;
  req.session.user=user;
  // // res.cookie("isLoggedIn",true);
  await req.session.save();
  res.redirect("/");
}
  
exports.postLogout=(req,res,next)=>{
  req.session.destroy(()=>{
     res.redirect("/login");
  })
  
}

exports.getSignUp=(req,res,next)=>{
   res.render('auth/signup', {      pagetittle: 'SignUp' ,
    isLoggedIn: false,
    errors: [],
    oldInput: {firstName: '', lastName: '', email: '', userType: ''},
    user:{}
   });

}

exports.postSignUp=[
  check("firstName")
  .trim()
  .isLength({min:2})
  .withMessage("First name should be of 2 character long")
  .matches(/^[A-Za-z\s]+$/)
  .withMessage("First Name should contains only alphabets"),

  check("lastName")
  .matches(/^[A-Za-z\s]*$/)
  .withMessage("last Name should contains only alphabets"),

  check("email")
  .isEmail()
  .withMessage("Please enter a valid email")
  .normalizeEmail(),

  check("password")
  .isLength({min:8})
  .withMessage("Password atleast contains 8 characters")
  .matches(/[A-Z]/)
  .withMessage("Password should contain atleast one uppercase letter")
  .matches(/[a-z]/)
  .withMessage("Password should contain atleast one lowercase letter")
  .matches(/[0-9]/)
  .withMessage("Password should contain atleast one number")
  .matches(/[!@&]/)
  .trim(),
   
   check("confirmPassword")
   .trim()
   .custom((value,{req})=>{
        if(value!==req.body.password){
          throw new Error("Password do not match");
        }
        return true;
   }),

   check("userType")
   .notEmpty()
   .withMessage("Please select a user type")
   .isIn(['guest', 'host'])
   .withMessage("Invalid userType"),

   check("terms")
   .notEmpty()
   .withMessage("Please accept the terms and condition")
   .custom((value,{req})=>{
    if(value!=="on"){
      throw new Error("Please accept the terms and condition");
    }
    return true;
   }),

  (req,res,next)=>{
     const {firstName,lastName,email,password,userType}=req.body;
     const errors=validationResult(req);
     if(!errors.isEmpty()){
      return res.status(422).render("auth/signup",{
        pagetittle:"Signup",
        isLoggedIn:false,
        errors:errors.array().map(err=>err.msg),
        oldInput:{firstName,lastName,email,password,userType},
        user:{}
      });
     }
     bcrypt.hash(password,12)
     .then(hashedPassword=>{
        const user=new User({
          firstName,
          lastName,
          email,
          password:hashedPassword,
          userType
        });
        return user.save();
     }) 
      .then(result=>{  
          console.log("User created successfully");
          res.redirect("/login");
      })
      .catch(err=>{
          console.error(err);
          return res.status(500).render("auth/signup",{
            pagetittle:"Signup",
            isLoggedIn:false,
            errors:["Internal Server Error"],
            oldInput:{firstName,lastName,email,password,userType},
            user:{}
          });
      });
}]