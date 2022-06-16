"user strict";

  
module.exports = (UserModel) =>  (req, res, next) => {

    if (req.headers['authorization']) {
        // the shape will be like the next line 
        // Bearer token
        let bearerHeaderParts = req.headers.authorization.split(' ');
        console.log("bearerHeaderParts>>>", bearerHeaderParts); //['Bearer','token']
        let token = bearerHeaderParts.pop(); 
        console.log("token >>>",token);
      
      

        UserModel.validateToken(token).then(user => {
            req.user = user;
            next();
        }).catch(error => { res.json( `invalid user ${error}` ) } )
    }


}

