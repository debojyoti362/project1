const express = require('express');
const router = express.Router({mergeParams:true});
const wrapasync = require("../utils/wrapasync.js");
const Review = require("../models/review.js");
const {reviewSchema} = require('../schema.js');
const Listing = require("../models/listing.js");
const{islogin,isOwner,isreviewauthor} = require("../middleware.js");
const reviewcontroller = require('../controller/reviews.js');

//FOR REVIEW VALIDATION
 const validreview = (req,res,next)=>
 {
    let {error} = reviewSchema.validate(req.body);
    
    if(error)
    {
       return(new expresserror(404 ,error));
    }
    else
    {
       next();
    }
 }
//[REVIEW SECTION]
router.post("/",
  islogin,
  validreview,
  wrapasync(reviewcontroller.createreview));
//DELETE REVIEW
router.delete("/:reviewid",
islogin,
isreviewauthor,
reviewcontroller.destroyreview
);

module.exports = router;