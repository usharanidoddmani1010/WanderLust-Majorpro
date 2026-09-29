const express = require("express");
const router = express.Router();

// posts
// Index 
router.get("/", (req, res) => {  // no need to write the /posts beause it is same for all so taken as common in the server.js so anhting start with the posts will redired to here
    res.send("GET for posts");
})

// Show 
router.get("/:id", (req, res) => {
    res.send("GET for show posts");
});

// post 
router.post("/", (req, res) => {
    res.send("Post for show posts");
});

// DELETE 
router.delete("/:id", (req, res) => {
    res.send("DELETE for show post id");
});

module.exports = router;