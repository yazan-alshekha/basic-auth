"user strict";

const bcrypt = require("bcrypt");

const UsersModel = (sequelize, DataTypes) => {


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

    Users.authenticateBasic = async function (username, password) {
        try {
            let user = await this.findOne({ where: { username: username } });
            let valid = await bcrypt.compare(password, user.password); //compare is a method to compare the real password with hashed password
            if (valid) {
                // generate new token
                
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

    return Users;
}
    module.exports = UsersModel;