const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image:  {
        type: String,
        default:"https://images.unsplash.com/photo-1625505825515-c2f8db4a29b5?q=80&w=1230&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        //this when the img is not coming then(null, undefined )
        set: (v) => 
            v === "" 
                ? "https://images.unsplash.com/photo-1625505825515-c2f8db4a29b5?q=80&w=1230&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                : v,  // this is when the img is comeing but the img is empty then use this 
    },
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;