"user strict";
const base64 = require("base-64");
  
module.exports = (UserModel) => async (req, res, next) => {

    if (req.headers['authorization']) {

        let basicHeaderParts = req.headers.authorization.split(' ');
        let encodedPart = basicHeaderParts.pop(); //encoded(username:password)
        console.log("encodedPart>>>", encodedPart);

        let decoded = base64.decode(encodedPart); //username,password
        console.log("decodedPart>>>", decoded);

        let [username, password] = decoded.split(':');//[username,password]

        UserModel.authenticateBasic(username, password).then(validUser => {
            req.user = validUser;
            next();
        }).catch(error => { next("invalid user") })
    }


}


// try{
//     let user=await UserModel.findOne( { where : {username:username} } );
//     let valid = await bcrypt.compare(password,user.password); //compare is a method to compare the real password with hashed password
//     if (valid){
//         req.user=user;
//         next();
//         // res.status(200).json( {username:username} );
//     }
//     else{
//         next('user is not valid');
//     }
// }catch(error){
//     next(error);
// }