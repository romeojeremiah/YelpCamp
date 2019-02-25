var express = require('express')
var router = express.Router({mergeParams: true})
var Camp = require('../models/camp')
//INDEX
//page to show all of the campgrounds will be campgrounds.ejs
router.get('/', function(req, res){
    //Get all campgrounds from DB
    Camp.find({}, function(err, camps){
        if(err){
            console.log(err);
        } else {
            res.render('campgrounds/index', {campgrounds: camps, currentUser: req.user}) //{Name on ejs page: Name of variable}
        }
    } )
})

//NEW - show form to create new campground
router.get('/new', isLoggedIn, function(req, res){
    res.render('campgrounds/new')
})

//CREATE - add new campground to DB
router.post('/', isLoggedIn, function(req, res){
    var campground_name = req.body.name
    var campground_url = req.body.imageurl
    var campground_description = req.body.description
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: campground_name, image: campground_url, description: campground_description, author:author}
    //Create a camp object and pass it to the campground page
    Camp.create(newCampground, function (err, camp){
        if(err){
            console.log(err);
        } else {
            console.log('newly created camp');
            console.log(newCampground);
        }
    });
    res.redirect('/')
})

router.get('/:id', function(req, res){
    //Find the campground with provided ID
    //render show template with that campground
    
    Camp.findById(req.params.id).populate('comments').exec(function(err, camps){
        console.log(camps)
        if(err){
            console.log(err)
        } else {
            console.log(camps)
            res.render('campgrounds/show', {campgrounds: camps})
        }
    })
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

module.exports = router