const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const  mongoose= require('mongoose');
const User = require("../models/user.js");
const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());
const server =  app.listen(process.env.PORT || 8081);
console.log(`Server is listening to ${server.address().port}`);
let db;
mongoose.connect('mongodb://localhost:27017/users').then(
    () => {db = mongoose.connection; console.log("Successfully connected to db")},
    err => {console.log(err); console.error("Unable to connect to db, shutting down the server"); server.close()}
);
//let db = mongoose.connection;
/*db.on("error", function (err) {
    console.log(err);
});*/
/*db.once("open", function () {
    console.log("Successfully connected to db" );
});
*/
/*app.get('/users', (req,res) => {
    User.find({}, "FL description",  function (error, users) {      // now returns only specific fields:
                                                                    // FL and description
        if (error){
            console.error(error);
        }
        res.send({
            users: users
        })
    }).sort({_id:-1})
});*/
app.get("/users", async (req, res) => {
    try {
        await User.find({}, "FL description")
            .then((users) => res.send({
                    users: users
                }),
            )
            .catch((error) => {
                console.error(`Error in GET(/users) in User.find()! ${error}`)
            })
    }
    catch (e) {
        console.error(`Error in GET(/users)! ${error}`)
    }
});
app.post('/users', (req, res) => {
    let FL = req.body.FL;
    let description = req.body.description;
    let new_user = new User({
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
    User.findById(req.params.id, 'FL description', function (error, user) {
        if (error) {
            console.error(error);
        }
        res.send(user);
    })
});



