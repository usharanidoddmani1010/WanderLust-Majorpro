const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");  // help to create template
const warpAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./ExpressError");
const {listingSchema} = require("./schema.js");

// mongoose connection

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(() => {
    console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

// validation middleware
const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);  
    if(error){
        let errMsg = error.details.map((el) => el.message).join(","); // the err come in obj so we can exptra that using errordtatils and map with each el with the messg and send with join by sperated by ,
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}
// index route (show all listings)
app.get("/listings", async (req, res) => {
    // Listing.find({}).then(res => {
    //     console.log(res);
    // })

    const allListings = await  Listing.find({});
    res.render("listings/index.ejs", {allListings});
});

//New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

// Show Route (show particular list)
app.get("/listings/:id", warpAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
}));

//create routes
app.post("/listings", validateListing,warpAsync(async (req, res) => {
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
app.get("/listings/:id/edit",warpAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

//Upadte Route

app.put("/listings/:id/", validateListing,warpAsync(async (req, res) => {
    // if(!req.body.listing){  
    //     throw new ExpressError(400, "Send valid data for listing");
    // }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id", warpAsync(async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
}));

// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing ({
//         title: "My New Villa ",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

// radom page which not found
app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));   //http://localhost:8080/random
});

// custom error handler
app.use((err, req, res, next) => {
    let {statusCode = 500, message = "something went wrong"} = err;
    // // res.send("something went wrong!");
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{message});  // if u send the err then u have to do the err.message in ejs file
});

app.listen(8080, () => {
    console.log("server is listining on port: 8080");
});