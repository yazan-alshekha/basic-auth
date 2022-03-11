"user strict"; 

require('dotenv').config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET=process.env.SECRET;
const UsersModel = (sequelize, DataTypes) => {


    const Users = sequelize.define("user", {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        token:{
            type:DataTypes.VIRTUAL
        },
    });

    Users.authenticateBasic = async function (username, password) {
        try {
            let user = await this.findOne({ where: { username: username } });
            let valid = await bcrypt.compare(password, user.password); //compare is a method to compare the real password with hashed password
            if (valid) {
                // generate new token
                // in order to generate a new token we are using the username and secret key as an arguments for sign method
                //token = username+secret
                let newToken = jwt.sign({username:user.username},SECRET);
                user.token=newToken;
                return user;
                // res.status(200).json( {username:username} );
            }
            else {
                console.log('user is not valid');
                return {message:"error -->password is wrong"};
            }
        } catch (error) {
            console.log("error",error);
            return;
            
        }
    }

    Users.validateToken = async function(token){
        // in order to get the username , we are using token and secret key as an argument fror verify method 
        // username = token+secret
        const parsedToken=jwt.verify(token,SECRET);
        console.log("parsedToken >>>",parsedToken); 
        let user = await this.findOne( { where: {username:parsedToken.username} } );
        if (user){
            return user
        }
        else{
            throw new Error("invalid token")
        }
    }


    return Users;
}
    module.exports = UsersModel;