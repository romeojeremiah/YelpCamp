var express  = require('express'),
    app = express(),
    ejs = require('ejs'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    seedDB = require('./models/seeds'),
    Comment = require('./models/comment'),
    LocalStrategy = require('passport-local'),
    passport = require('passport'),
    User = require('./models/user')

//requiring routes
var commentRoutes = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes = require('./routes/index')

//import stylesheet
app.use(express.static(__dirname + "/public"))

//import files from models folder
var Camp = require('./models/camp')


mongoose.connect('mongodb://localhost:27017/yelpCamp', {useNewUrlParser: true}, function(error){
    if(error){
        console.log(error);
    } else {
        console.log('db connected!');
    }
});

//seed the database
//seedDB()

// configure Passport

//setup express session
app.use(require('express-session')({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate())) //User methods come from Locale Passport
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//middleware to look for logged in users
app.use(function(req, res, next){
    res.locals.currentUser = req.user
    next()
})

app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static('public'))

//set the view engine to render ejs pages
app.set('view engine', 'ejs') 

app.use("/", indexRoutes)
app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/comments", commentRoutes)


//add a local port to serve from
app.listen(3000, function(req, res){
    console.log('YelpCamp Server running on port 3000')
})