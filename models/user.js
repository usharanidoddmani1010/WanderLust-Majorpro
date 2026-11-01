const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    } // no need of the pass and user here because passport add it 

});

userSchema.plugin(passportLocalMongoose);  // this added automaticly username, password, hashing

module.exports = mongoose.model('User', userSchema);
