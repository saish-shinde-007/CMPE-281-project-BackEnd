var express = require('express');
var router = express.Router();
var mongo = require('./mongodb/mongo');
var session = require('client-sessions');
var url='mongodb://dheemanth10:Dheemanth0@ds117422.mlab.com:17422/project-281'
var expressSessions = require("express-session");


router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

var dummy="dummy";

router.post('/login', function (req, res, next) {

    var email = req.body.email;
    var password = req.body.password;
    console.log("reached login");

    mongo.connect(function (db) {
        var coll = db.collection('user');
        coll.findOne({'email': email, 'password': password}, function (err, user) {
            if (err) {
                res.json({
                    status: '401'
                });
            }
            if (!user) {
                console.log('User Not Found with email ' + email);
                res.json({
                    status: '401'
                });
            }
            else {
                // dummy=user.Username;
                res.json({
                    email: email,
                    status: 200,
                    value: user
                });
            }
        });
    });
});


router.post('/signup', function (req, res, next) {

    var email = req.body.email;
    var Username = req.body.username;
    var password = req.body.password;

    console.log("email :" + email);
    console.log("UserName :" + Username);

    var data = {Username : Username,
        email : email,
        password : password
    }
    mongo.connect(function(db){
        console.log("Connected to MongoDB at ",url)

        var coll = db.collection('user');
        coll.findOne({'email':email},function (err,user) {
            if(err){
                console.log("sending status 401")
                res.json({
                    status : '401'
                });
            }
            else if(user){
                console.log("sending status 401")
                res.json({
                    status : '401'
                });
            }

            else{
                mongo.insertDocument(db,'user',data,function (err,results) {
                    if (err) {
                        console.log("sending status 401")
                        res.json({
                            status: '401'
                        });
                    }
                    else {
                        console.log("User Registered")
                        var path = results["ops"][0]["_id"];
                        console.log(path);
                        res.json({
                            status: 200,
                        });
                    }
                });
            }
        })
    });
});
router.post('/logout', function(req,res){
    var session=req.session;
    dummy="dummy";
    console.log("In logout ", req.session.user)
    session.user = null;
    session.destroy();
    res.json({
        status:'200',
        message : "Logged Out."
    });
});
module.exports = router;