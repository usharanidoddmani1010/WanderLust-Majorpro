const express = require("express");
const app = express();
const users = require("./routes/user.js"); // writng this much is not enough this is just a obj we need to use 
const posts = require("./routes/post.js");
const cookieParser = require("cookie-parser");



// Cookies (piese of information stored in browse)

app.use(cookieParser("secreatecode")); // this is middle ware is called then it send the req cookies to 
// without installiing package give me undifined

//signed cookies
app.get("/getsignedcookies", (req, res) => {
    res.cookie("made-in", "India", {signed: true});
    res.send("signed cookies sent");
});

// verify cookies
app.get("/verify", (req, res) => {
    // console.log(req.cookies); // if verited then {} printed in the terminal if unsigned found that printed in the terminal
    console.log(req.signedCookies); // to access only the signed cookes os here only signed cookies get printed the unsinged will not get printed so like this we can verify that owr cookies got modified or not
    // imp if the small part of the singed cookies got modified then in termial name : false will get printed 
    // if whole value got replaed with other then {}
    res.send("verified");
});

app.get("/getcookies", (req, res) => {
    res.cookie("greet", "namaste"); // cookies methond and inside name and the value // inscept -- application -- cookies --- click
    res.cookie("madeIn", "India");
    res.send("sent you some cookies");
});
/// we can also add the cookies from the brower

app.get("/greet",(req, res) => {
    let {name = "anonymous"} = req.cookies;
    res.send(`Hi ${name}`);
})

app.get("/", (req, res) => {
    console.dir(req.cookies); // direct acces is not possible so we use the cookes parser npm packeage middle ware
    res.send("Hi, I am root!");
});



// use the router obj and triger the user path in the user file
app.use("/users", users);  // /users is the common path so we can write here so the path folowed by users is rediret to the users in the users file what is defined in the users file get trigerd
// meaning is first one is common path followed by anything wrote in the file , second one is the path start the users then it use the users files so we can use the defined 
app.use("/posts", posts);

app.listen(3000, () => {
    console.log("server is listing to 3000")
})