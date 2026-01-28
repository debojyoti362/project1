const express = require('express');
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const wrapasync = require("../utils/wrapasync.js");
const {listingSchema} = require('../schema.js');
const {islogin, isOwner,validatelisting} = require("../middleware.js");
const listingcontroller = require("../controller/listings.js");
const multer = require("multer");
const {storage} =require("../cloudConfig.js");
const upload=multer({storage});


//  INDEX ROUTE
router.route("/")
.get(wrapasync(listingcontroller.index))
.post(islogin,
 validatelisting,
upload.single('listing[image]'),

wrapasync(listingcontroller.createnew));

// NEW ROUTE
router.get("/new",islogin,listingcontroller.newrouterform);

router.route("/:id")
// for a particular show
.get(wrapasync(listingcontroller.show))
// for edit update
.put(islogin,
  isOwner,
 validatelisting,
  upload.single('listing[image]'),
  wrapasync(listingcontroller.editedpost))
// for delete a particular listing
  .delete(
  islogin,
  isOwner,
  wrapasync(listingcontroller.delete));

//EDIT ROUTE
router.get("/:id/edit",islogin,wrapasync(listingcontroller.rendereditform));
module.exports = router;