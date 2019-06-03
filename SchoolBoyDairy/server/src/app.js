const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
var mongoose= require('mongoose');
var User = require("../models/user.js");
const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

mongoose.connect('mongodb://localhost:27017/users');
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"))
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
    })

    new_user.save(function (error) {
        if(error){
            console.log(error)
        }
        res.send({
            success: true,
            message: 'User ' + new_user.FL + ' saved successfully'
        })
    })
});



app.listen(process.env.PORT || 8081);
