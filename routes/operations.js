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
        console.log("Connected to MongoDB at ",url);

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

router.post('/temp', function (req, res, next) {

    var body = req.body;
    console.log("reached temp");

    mongo.connect(function (db) {
        console.log("Connected to MongoDB at ",url);
        var coll = db.collection('Temperature');
        coll.find({}).toArray(function (err, user) {
            if (err) {
                res.json({
                    status: '401'
                });
            }
            if (!user) {
                console.log('Temperature ' + user);
                res.json({
                    status: '401'
                });
            }
            else {
                // dummy=user.Username;
                console.log('Temperature ' + user[user.length-1].temperature);
                let last_temp=user[user.length-1].temperature;
                res.json({
                    temperature: last_temp,
                    // value:user
                });
            }
        });
    });
});

router.post('/humid', function (req, res, next) {
    console.log("reached humid");

    mongo.connect(function (db) {
        console.log("Connected to MongoDB at ",url);
        var coll = db.collection('Humidity');
        coll.find({}).toArray(function (err, user) {
            if (err) {
                res.json({
                    status: '401'
                });
            }
            if (!user) {
                console.log('Temperature ' + user);
                res.json({
                    status: '401'
                });
            }
            else {
                console.log('Temperature ' + user[user.length-1].Humidity);
                let last_temp=user[user.length-1].Humidity;
                res.json({
                    humidity: last_temp,
                });
            }
        });
    });
});

router.post('/table', function (req, res, next) {
    console.log("reached table");
    var device_type = req.body.device_type+" Sensor";
    var street_name = req.body.street_name;

    console.log("device_type :" + device_type);
    console.log("street_name :" + street_name);
    mongo.connect(function (db) {
        console.log("Connected to MongoDB at ",url);
        var coll = db.collection('Table');
        if(device_type!=="All Sensor" || street_name!=="All"){
            coll.find({'devicetype': device_type, 'location': street_name}).toArray(function (err, user) {
                if (err) {
                    res.json({
                        status: '401'
                    });
                }
                if (!user) {
                    console.log('Temperature ' + user);
                    res.json({
                        status: '401'
                    });
                }
                else {
                    // dummy=user.Username;
                    console.log("Table-->",user);
                    res.json({
                        deviceData: user
                    });
                }
            });
        }
        else{
            coll.find({}).toArray(function (err, user) {
                if (err) {
                    res.json({
                        status: '401'
                    });
                }
                if (!user) {
                    console.log('Temperature ' + user);
                    res.json({
                        status: '401'
                    });
                }
                else {
                    // dummy=user.Username;
                    console.log("Table-->",user);
                    res.json({
                        deviceData: user
                    });
                }
            });
        }
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