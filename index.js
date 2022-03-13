"use strict";

const express = require("express");
const bcrypt = require("bcrypt");
const base64 = require("base-64");

const Users = require('./models/user.model');
const basic_auth = require('./middlewares/basic-auth');
const bearer_auth= require("./middlewares/bearer_auth");
const { Sequelize, DataTypes } = require('sequelize');
const acl = require('./middlewares/acl');

const app = express();
app.use(express.json());

const DATABASE_URL = 'postgresql://yazan_alshekha:0000@localhost:5432/basic_auth';

const sequelize = new Sequelize(DATABASE_URL, {});

const UserModel = Users(sequelize,DataTypes);





//home route
app.get('/', (req, res) => {
    res.send("Hello world");
});


app.post('/signup', signupFunc);

app.post('/signin',basic_auth(UserModel),signinFunc);
app.get("/user",bearer_auth(UserModel),userHandler);




// localhost:3030/signup >> body{username:'razan',password:'test123'}
async function signupFunc(req, res) {
    
    // in this route we are getting the username and the password from the body
    //then we hashing the password and add the new user and the hashedPassword to the database
    let { username, password ,role} = req.body;
    console.log(`${username}:${password}`);
    try{
        let hashedPassword= await bcrypt.hash(password,5);
        console.log("hashedPassword >>>",hashedPassword);
        const newUser=await UserModel.create({
            username:username,
            password:hashedPassword,
            role:role,
        });
        res.status(201).json({newUser});
        // res.status(201).send('ssss');
    
    }catch(error){
        console.log(error);
    }
    
}

// localhost:3030/sigin >> Authorization >> 'Basic encoded(username:password)'
function signinFunc(req,res){
        res.status( 200).json( req.user );

}

function userHandler(req,res){
    res.status(200).json( req.user );
}

app.get('/img', bearer_auth(UserModel), acl('read'), (req, res) => {
    res.send('you can read this image');
});

app.post('/img',  bearer_auth(UserModel), acl('create'), (req, res) => {
    res.send('new image was created');
});
app.put('/img',  bearer_auth(UserModel), acl('update'), (req, res) => {
    res.send('image updated');
});
app.delete('/img',  bearer_auth(UserModel), acl('delete'), (req, res) => {
    res.send('image deleted');
});


sequelize.sync().then(() => {
    app.listen(3030, () => {
        console.log("listen on port")
    });
});



