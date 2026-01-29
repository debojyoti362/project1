if(process.env.NODE_ENV != "production")
{
  require('dotenv').config();
}

// BASIC REQUIREMENTS
 const express = require("express");
 const app= express();
 const mongoose = require("mongoose");
 const port = 8080;
 const dburl = process.env.ATLASDB_URL
 const path = require("path");
 const methodOverride = require("method-override");
 const ejsMate = require("ejs-mate");
 const expresserror = require("./utils/expresserror.js");
 const reviewsRouter = require("./routes/reviews.js");
 const userRouter = require("./routes/user.js");
 const listingsRouter = require("./routes/listings.js");
 const session = require("express-session");
 const MongoStore = require('connect-mongo').default;
 const flash = require('connect-flash');
 const passport = require("passport");
 const LocalStrategy= require("passport-local");
 const User=require("./models/user.js");
  if (!dburl) 
    {
  throw new Error("ATLASDB_URL is missing");
    }
 //for mongo store
 const store = MongoStore.create({
  mongoUrl : dburl,
  crypto:
  {
    secret:process.env.SECRET,
  },
  touchAfter: 24*3600,
 });
 store.on("error",(err)=>{
  console.log("Error in mongo session ",err);
})

//FOR SESSION 
const sessionoption =
{
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:
  {
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  }
 }
 
 app.use(session(sessionoption));
 app.use(flash());

//FOR PASSWORD
 app.use(passport.initialize());
 app.use(passport.session());
 passport.use(new LocalStrategy(User.authenticate()));

 passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser());

//FOR FLASH AND CUREENT USER
 app.use((req,res,next)=>{
   res.locals.success = req.flash("success")||[];
   res.locals.error =req.flash("error")||[];
   res.locals.currentuser = req.user || null;
   next();
 })



//PUBLIC PATH SETTING WITH MIDDLEWARE
 app.set("view engine","ejs");
 app.set("views",path.join(__dirname,"views"));
 app.use (express.urlencoded({extended:true}));
 app.use(express.json());
 app.use(methodOverride("_method"));
 app.engine("ejs",ejsMate);
 app.use(express.static(path.join(__dirname, 'public')));

//LISTING ROUTE GETTING ,  REVIEW ROUTE GETTING  , USER ROUTE
 app.use("/listings",listingsRouter);
 app.use("/listings/:id/reviews",reviewsRouter);
 app.use("/",userRouter);

// for all path
 app.all(/.*/,(req,res,next)=>
 {
    return next(new expresserror(404,"page not found!"));
 });

 app.use((err,req,res,next)=>
 {
   let {status=500,message="something went wrong!"} = err;
   res.render("error.ejs",{message});
 });
 //DATABASE CONNECTION
  main().then(()=>{
    console.log("connected to database");  
  })
  .catch((err)=>
  {
    console.log(err);
  });
 async function main()
 {
    await mongoose.connect(dburl);
 }
 app.listen(port,()=>
 {
    console.log("Listening.......");
 });