const express = require("express");
const router = express.Router({ mergeParams: true}); // without merge parms if i add the review it give me Cannot read properties of null (reading 'reviews')
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../ExpressError");
const { reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

// validation for review
const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);  
    if(error){
        let errMsg = error.details.map((el) => el.message).join(","); // the err come in obj so we can exptra that using errordtatils and map with each el with the messg and send with join by sperated by ,
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

//Review
//post routes
router.post("/", validateReview, wrapAsync(async(req, res) => {
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);  // here we never get the id beause the path with contain the id is in other (app) file so to make the id to send here we use the mergeparms
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);  // reviews is the array where i am pushing my data

    await newReview.save();
    await listing.save();

    // console.log("new review saved");
    // res.send("new review saved");

    res.redirect(`/listings/${listing._id}`);
}));


// Delete route
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {review: reviewId}) // the revmoed review must also removed by the reviews of the listing so we use this 
    // means in id reviewid mathching review from the id get deleted
    await Review.findByIdAndDelete(reviewId); // this is the remvoing the reviews from the reviews by the id 

    res.redirect(`/listings/${id}`);
}));

module.exports = router;