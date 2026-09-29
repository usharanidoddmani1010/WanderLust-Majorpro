const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../ExpressError");
const {listingSchema, reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");


// validation middleware
const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);   // validate this if error throw this below
    if(error){
        let errMsg = error.details.map((el) => el.message).join(","); // the err come in obj so we can exptra that using errordtatils and map with each el with the messg and send with join by sperated by ,
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

// index route (show all listings)
router.get("/", async (req, res) => {
    // Listing.find({}).then(res => {
    //     console.log(res);
    // })

    const allListings = await  Listing.find({});
    res.render("listings/index.ejs", {allListings});
});

//New Route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

// Show Route (show particular list)
router.get("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing});
}));

//create routes
router.post("/", validateListing,wrapAsync(async (req, res) => {
    // let {title, description, image , price, country, location} = req.body;  another approch 
    // let listing = req.body;
    // try{
        // if(!req.body.listing){ // it only says that if not listing then throw the err what if we sent the listing but inside the listing some values are missed (test in hoppscotach in body write listing[title] ...)
        //     throw new ExpressError(400, "Send valid data for listing");
        // } // this handle the client error so when we run this without send the data then this error will occure and handle by this
        // const newListing = new Listing(req.body.listing); // instant creation
        
        // two solution for the err occures 
        // first way
        // if(!newListing.title){
        //     throw new ExpressError(400, "Title is missing");
        // }
        // if(!newListing.description){
        //     throw new ExpressError(400, "Descrition is missing");
        // }
        // if(!newListing.price){
        //     throw new ExpressError(400, "price is missing");
        // }
        // if(!newListing.location){
        //     throw new ExpressError(400, "location is missing");
        // }
       
        // if(!newListing.country){
        //     throw new ExpressError(400, "country is missing");
        // }

        // 2nd way using joi tool

        // let result = listingSchema.validate(req.body);  // check that my defined schema is followed
        // console.log(result); // it added in the page but in console we can see what the error 
        // if(result.error){
        //     throw new ExpressError(400, result.error);
        // } // it throw the error for all individul and whole listing
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings"); // thorw hoppscotch when i try to run this api without posting any obj with it (client error will occur)
    // }catch(err) { 
    //     next(err);
        // console.log(err);
        // res.render(err);
// }
    // console.log(listing);
}));

//Edit Route
router.get("/:id/edit",wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

//Upadte Route

router.put("/:id/", validateListing,wrapAsync(async (req, res) => {
    // if(!req.body.listing){  
    //     throw new ExpressError(400, "Send valid data for listing");
    // }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
}));

module.exports = router;
