const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const { listingSchema } = require("./schema.js");
 function islogin(req,res,next){
  
   if(!req.isAuthenticated())
  {
     req.session.saveUrl = req.originalUrl;
     req.flash("error","you must be logged in before creation of listings");
     return res.redirect("/login");
  }
  next();
 } 
 function redirecturl(req,res,next){
   if(req.session.saveUrl)
   {
       res.locals.saveUrl = req.session.saveUrl;
   }
   next();
 }
 async function  isOwner (req,res,next){
  let{id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentuser._id))
    {
       req.flash("error","you dont have permission to edit");
       return res.redirect(`/listings/${id}`);
    }
    next();
 }
 //have to define all middlewares here
 async function  isreviewauthor (req,res,next){
  let{id,reviewid} = req.params;
    let review = await Review.findById(reviewid);
    if(!review.author.equals(res.locals.currentuser._id))
    {
       req.flash("error","you are not the author of the review");
       return res.redirect(`/listings/${id}`);
    }
    next();
 }
 function validatelisting (req,res,next){
        let{error} = listingSchema.validate(req.body);
        if(error)
        {
           throw new expresserror(404,error);
        }
        else
         {
          next();
         }
       }
   //------for geocoding coordination -------------------------------------------------------------------------
   async function geocodinglocation(location)
   {
     const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
     
     const response = await fetch(url,{
      headers:{
         "User-Agent":"Wonderlust"
      }
     });
     const data = await response.json();

     if(!data.length)
     {
           throw new expresserror("Location not found");        
     }

     return {
      lat:parseFloat(data[0].lat),
      lng:parseFloat(data[0].lon)
     };
   }
 module.exports={islogin,redirecturl,isOwner,isreviewauthor ,validatelisting ,geocodinglocation};
