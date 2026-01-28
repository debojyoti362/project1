const Listing = require('../models/listing.js');
const {geocodinglocation} = require('../middleware.js');
const listing = require('../models/listing.js');
//const {islogin,isOwner} = require("../middleware.js");
module.exports.index= async (req,res)=>
{
   const allListings =await Listing.find({});
   res.render("listings/index",{allListings});
}

module.exports.newrouterform =(req,res)=>
{
    res.render("listings/new.ejs");
}

module.exports.show = async(req,res)=>
{
  let {id} = req.params;
  const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
  if(!listing)
  {
     req.flash("error","Sorry this listing does not exist!");
     return res.redirect("/listings");
  }
  //console.log(listing);
  res.render("listings/show.ejs",{listing});
}

module.exports.createnew =async(req,res)=>
{
   let url= req.file.path;
   let filename=req.file.filename;
   const newListing = new Listing(req.body.listing);
   //--for calculating the geocode---------------------------------------------------------------------------
   const cords = await geocodinglocation(newListing.location);
   newListing.geometry={
      type:"Point",
      coordinates:[cords.lng,cords.lat],
   }
   newListing.owner = req.user._id;
   newListing.image={filename,url};
   await newListing.save();
   console.log(newListing);
   req.flash("success","Successfuly Saved");
   res.redirect("/listings");
}

module.exports.rendereditform = async(req,res)=>
{
   let{id} = req.params;
   const listing = await Listing.findById(id);
   let originalimage = listing.image.url.replace("/upload","/upload/h_200,w_350");
   res.render("listings/edit.ejs",{listing,originalimage});
}
module.exports.editedpost = async(req,res,next)=>
{
  let{id} = req.params;
  let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
  if( typeof req.file!=="undefined")
  {
   let url = req.file.path;
   let filename=req.file.filename;
  listing.image={url,filename};
  await listing.save();
  }
  req.flash("success","Successfully Updated");
  res.redirect(`/listings/${id}`);
}

module.exports.delete=async(req,res)=>
{
  let{id} = req.params;
  await Listing.findByIdAndDelete(id);
  console.log("Yes Deleted!");
  req.flash("success","Successfully Deleted!");
  res.redirect("/listings");
}