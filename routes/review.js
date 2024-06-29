const express=require("express");
const router=express.Router({mergeParams:true});
const WrapAsync = require("../utils/WrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const ReviewController=require("../contollers/reviews.js");
const validateReview = (req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
     if(error){
      let errMsg=error.details.map((el)=>el.message).join(",");
       throw new ExpressError(400,error);
     }else{
       next();
     }
  };

//reviews
//post route
router.post("/",
    validateReview,
    isLoggedIn,
    WrapAsync(ReviewController.postReview));
//delete review route

router.delete("/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  WrapAsync(ReviewController.destroyReview)
);
module.exports=router;