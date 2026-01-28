const Listing = require('../models/listing.js');
const Review = require("../models/review.js");

module.exports.createreview = async(req,res)=>
{
  console.log(req.params.id);
  let listing = await Listing.findById(req.params.id);
  let react = new Review(req.body.review);
  let id = req.params.id;
  react.author = req.user._id;
  console.log(react);
  listing.reviews.push(react);
  await react.save();
  await listing.save();
  req.flash("sucess","Review uploaded");
  res.redirect(`/listings/${id}`);
}
module.exports.destroyreview=async(req,res)=>
{
  let {id , reviewid} = req.params;
  await Listing.findByIdAndUpdate(id ,{$pull:{reviews:reviewid}});
  let delreview = await Review.findByIdAndDelete(reviewid);
  let dellist = await Listing.findById(id);
  console.log(delreview);
  console.log(dellist);
  req.flash("sucess","Sucessfully Deleted");
  res.redirect(`/listings/${id}`);
}