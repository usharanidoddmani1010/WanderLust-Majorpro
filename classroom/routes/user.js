const express = require("express");
const router = express.Router(); // web(express.js-api-router) // this is used to create the router obj

// Index - users
router.get("/", (req, res) => {  // no need to write the /users beause it is same for all so taken as common in the server.js so anhting start with the user will redired to here
    res.send("GET for users");
})

// Show - users
router.get("/:id", (req, res) => {
    res.send("GET for show users");
});

// post - users)(new or create users)
router.post("/", (req, res) => {
    res.send("Post for show users");
});

// DELETE - users
router.delete("/:id", (req, res) => {
    res.send("DELETE for show user id");
});

module.exports = router;