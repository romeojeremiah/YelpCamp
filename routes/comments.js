var express = require('express')
var router = express.Router({mergeParams: true})
var Camp = require('../models/camp')
var Comment = require('../models/comment')
//=====================
//COMMENTS ROUTE

router.get('/new', isLoggedIn, function(req,res){
    Camp.findById(req.params.id, function(err, campground){
        console.log(req.params.id)
        if(err){
            console.log(err)
        } else {
            console.log(campground)
            res.render('comments/new', {campground: campground})
            console.log(campground)
        }
    })
})

router.post('/', function(req, res){
    //lookup campground using ID
    //create new comment
    //connect new comment to campground
    //redirect back to campground show page
    Camp.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err)
            res.redirect('/campgrounds')
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err)
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username
                    comment.save()
                    //associate comment to campground
                    campground.comments.push(comment)
                    campground.save()
                    res.redirect('/campgrounds/' + campground._id)
                }
            })
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