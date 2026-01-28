const User = require("../models/user.js");

module.exports.signuppage=(req,res)=>
{
  res.render("./users/signup.ejs");
}

module.exports.signup=async(req,res)=>
{
  try
  {
  let{username ,email ,password} = req.body;
  const user1 = new User({username,email});
  const registerduser = await User.register(user1,password);
  console.log(registerduser);
  req.login(registerduser,(err)=>{
    if(err)
    {
      return next(err);
    }
    req.flash("success","Registered Successfuly");
    res.redirect("/listings");
  })
  }
  catch(e)
  {
     req.flash("error",e.message);
     res.redirect("/signup");
  }
}

module.exports.loginpage = (req,res)=>{
    res.render("../views/users/login.ejs");
}

module.exports.login=async(req,res)=>  
{
    req.flash("success","Successfuly logged in ");
    let reurl = res.locals.saveUrl||"/listings";
    res.redirect(reurl);
}
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
      if(err)
      {
         return next(err);
      }
    })
    req.flash("success","logged you out");
    res.redirect("/listings");
}