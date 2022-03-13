'use strict';
function acl(role) {
    return (req, res, next) => {
        try {
            if (req.user.actions.includes(role)) {
                
                next();
            } else {
                console.log("access denied");

                next('access denied')
            }
        } catch (e) {

        }
    }
}

module.exports = acl;