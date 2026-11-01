const express = require("express");
const app = express();
const users = require("./routes/user.js"); // writng this much is not enough this is just a obj we need to use
const posts = require("./routes/post.js");
// const cookieParser = require("cookie-parser");
const session = require("express-session");
const { render } = require("ejs");
const flash = require("connect-flash");
const path = require("path");



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// // Cookies (piese of information stored in browse)

// app.use(cookieParser("secreatecode")); // this is middle ware is called then it send the req cookies to
// // without installiing package give me undifined

// //signed cookies
// app.get("/getsignedcookies", (req, res) => {
//     res.cookie("made-in", "India", {signed: true});
//     res.send("signed cookies sent");
// });

// // verify cookies
// app.get("/verify", (req, res) => {
//     // console.log(req.cookies); // if verited then {} printed in the terminal if unsigned found that printed in the terminal
//     console.log(req.signedCookies); // to access only the signed cookes os here only signed cookies get printed the unsinged will not get printed so like this we can verify that owr cookies got modified or not
//     // imp if the small part of the singed cookies got modified then in termial name : false will get printed
//     // if whole value got replaed with other then {}
//     res.send("verified");
// });

// app.get("/getcookies", (req, res) => {
//     res.cookie("greet", "namaste"); // cookies methond and inside name and the value // inscept -- application -- cookies --- click
//     res.cookie("madeIn", "India");
//     res.send("sent you some cookies");
// });
// /// we can also add the cookies from the brower

// app.get("/greet",(req, res) => {
//     let {name = "anonymous"} = req.cookies;
//     res.send(`Hi ${name}`);
// })

// app.get("/", (req, res) => {
//     console.dir(req.cookies); // direct acces is not possible so we use the cookes parser npm packeage middle ware
//     res.send("Hi, I am root!");
// });

// // use the router obj and triger the user path in the user file
// app.use("/users", users);  // /users is the common path so we can write here so the path folowed by users is rediret to the users in the users file what is defined in the users file get trigerd
// // meaning is first one is common path followed by anything wrote in the file , second one is the path start the users then it use the users files so we can use the defined
// app.use("/posts", posts);

// app.use(
//   session({
//     secret: "mysupersecretstring",
//     resave: false,
//     saveUninitialized: true,
//   }),
// );

// app.get("/reqcount", (req, res) => {
//     if(req.session.count) {
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`You sent a request ${req.session.count} times`);
// });

// app.get("/test", (req, res) => {
//   res.send("test successfull");
// });

const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7days in the mili sec
        maxAge: 7*24*60*60*1000,
    }
};

app.use(session (sessionOptions));


app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error"); 
    next();
})
app.get("/register", (req, res) => {
    let { name = "anonymous" } = req.query;
    // console.log(req.session);
    req.session.name = name;
    // console.log(req.session.name);
    // res.send(name);
    if(name === "anonymous") {
        req.flash("error", "user not registerd");
    }else{
        req.flash("success","user registerd successfully"); // key and mess
    }
    res.redirect("/hello");
});

app.get("/hello", (req, res) =>{
// res.send(`hello, ${req.session.name}`);
    // console.log(req.flash('success'));
    // msg will shown only one time 
    // res.locals.messages = req.flash("success"); // locals are stroing the temp flash to use them futher
    // res.locals.successMsg = req.flash("success");
    // res.locals.errorMsg = req.flash("error");  // better to use the middlewares 
    res.render("page.ejs", {name: req.session.name /*msg: req.flash('success')*/}); // using local we can send the mess to page with sending the atributs of scuess and falilur
});

app.listen(3000, () => {
  console.log("server is listing to 3000");
});
