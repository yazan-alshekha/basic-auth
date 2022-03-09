"use strict";

const express = require("express");
const bcrypt = require("bcrypt");
const base64 = require("base-64");


const { Sequelize, DataTypes } = require('sequelize');
const { password, user } = require("pg/lib/defaults");


const app = express();
app.use(express.json());

const DATABASE_URL = 'postgresql://yazan_alshekha:0000@localhost:5432/basic_auth';

const sequelize = new Sequelize(DATABASE_URL, {});


const Users = sequelize.define("user", {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});


app.get('/', (req, res) => {
    res.send("Hello world");
});


app.post('/signup', signupFunc);
app.post('/signin',signinFunc);



// localhost:3030/signup >> body{username:'razan',password:'test123'}
async function signupFunc(req, res) {
    // in this route we are getting the username and the password from the body
    //then we hashing the password and add the new user and the hashedPassword to the database
    let { username, password } = req.body;
    console.log(`${username}:${password}`);
    try{
        let hashedPassword= await bcrypt.hash(password,5);
        console.log("hashedPassword >>>",hashedPassword);
        const newUser=await Users.create({
            username:username,
            password:hashedPassword,
        });
        res.status(201).json({newUser});
        // res.status(201).send('ssss');
    
    }catch(error){
        console.log(error);
    }
    
}

// localhost:3030/sigin >> Authorization >> 'Basic encoded(username:password)'
async function signinFunc(req,res){
    if (req.headers['authorization']){
        
        let basicHeaderParts= req.headers.authorization.split(' ');
        let encodedPart=basicHeaderParts.pop(); //encoded(username:password)
        console.log("encodedPart>>>",encodedPart);

        let decoded = base64.decode(encodedPart); //username,password
        console.log("decodedPart>>>",decoded);

        let [username,password]=decoded.split(':');//[username,password]

        try{
            let user=await Users.findOne( { where : {username:username} } );
            let valid = await bcrypt.compare(password,user.password);
            if (valid){
                res.status(200).json( {username:username} );
            }
            else{
                res.send('user is not valid');
            }
        }catch(error){
            res.send(error);
        }
    }
}


sequelize.sync().then(() => {
    app.listen(3030, () => {
        console.log("listen on port")
    });
});

