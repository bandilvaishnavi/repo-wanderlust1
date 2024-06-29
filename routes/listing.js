const express=require("express");
const router=express.Router();
const WrapAsync = require("../utils/WrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner}=require("../middleware.js");
const listingController=require("../contollers/listings.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

const validateListing = (req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
     if(error){
       
        let errMsg=error.details.map((el)=>el.message).join(",");
       throw new ExpressError(400,error);
     }else{
       next();
     }
 };

router
   .route("/") 
   .get(
   WrapAsync(listingController.index))
   .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    WrapAsync(listingController.createListing));


//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router
  .route("/:id")
  .get(
   WrapAsync(listingController.showListing))
  .put(isLoggedIn,isOwner,
   upload.single("listing[image]"),
   validateListing,
   WrapAsync(listingController.updateListing))
 .delete(isLoggedIn,isOwner,
  WrapAsync(listingController.destroyListing)
);

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,
   WrapAsync(listingController.editListing));

module.exports=router;