const express = require('express');

/* Those are added to fix  "undefined  method or function
for app.get() app.post() and seems to work fine
https://intellij-support.jetbrains.com/hc/en-us/community/posts/115000006064-unresolved-function-or-method
5 May 19
*/
const serve_static = require('serve-static');
const express_server_static_core = require('express-serve-static-core');

const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const  mongoose= require('mongoose');
var User = require("../models/user.js");
const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/users');
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function (callback) {
    console.log("Successfully connected to db");

});

app.get('/users', (req,res) => {
    User.find({},  function (error, users) {    /*https://mongoosejs.com/docs/api.html#model_Model.find
                                                additional parameter 'title description' from Post.find()  from 'https://gist.github.com/anaida07/bc6e32e8c99d796b294d04074192cc02#file-fetch-all-posts-js'
                                                is useless -- it's provides only additional filter.
                                                https://mongoosejs.com/docs/api.html#model_Model.find
                                                */
        if (error){
            console.error(error);
        }
        res.send({
            users: users
        })
    }).sort({_id:-1})
});
app.post('/users', (req, res) => {
    var db =req.db;
    var FL = req.body.FL;
    var description = req.body.description;
    var new_user = new User({
        FL: FL,
        description: description
    });

    new_user.save(function (error) {
        if(error){
            console.log(error);
        }
        res.send({
            success: true,
            message: 'User ' + new_user.FL + ' saved successfully'
        })
    })
});

// Update one  single user
app.put('/users/:id', (req, res) => {
    var db = req.db;
    User.findById(req.params.id, 'FL description' ,function (error, user) {
        if (error) {
            console.error(error);
        }
        user.FL = req.body.FL;
        user.description = req.body.description;
        user.save(function (error) {
            if (error) {
                console.error(error);
            }
            res.send({
                success: true
            })
        })
    })
});

//Delete one user
app.delete('/user/:id', (req, res) => {
    var db = req.db;
    User.remove({
        _id: req.params.id,
    },
        function (error, user) {
            if (error){
                console.error(error);
                return res.send(error);
        }
            res.send({
                success: true
            });
            console.log(`Deleted ${req.params.id}`)
    })
});

// Fetch one single user
app.get('/user/:id', (req, res) =>{
    var db = req.db;
    User.findById(req.params.id, 'FL description', function (error, user) {
        if (error) {
            console.error(error);
        }
        res.send(user);
    })
});


app.listen(process.env.PORT || 8081);
