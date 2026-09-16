const Joi = require('joi');  //joi.dev --- install throw npm   (joi is a tool for schema validation)

module.exports.listingSchema = Joi.object({
    listing : Joi.object({ //listing is the obj name in joi and Joi.object() this says that when a request come it should contain the listing obj
        title: Joi.string().required(),  // if want more see the doc of joi.dev
        description: Joi.string().required(),   
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null)
    }).required() 
});