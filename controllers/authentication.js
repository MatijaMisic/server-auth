const jwt = require('jwt-simple');
const config = require('../config');

const User = require('../models/User');

function tokenForUser(user){
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
    res.send({token: tokenForUser(req.user)})

}

exports.signup = function(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email: email})
     .then((user) => {
         if(user) {
             return res.status(422).json({error: 'Email is in use'})
         }

         const newUser = new User({
             email:email,
             password: password
         })

         newUser.save()
         .then(() => {
           console.log(newUser);
           
            res.json({token: tokenForUser(newUser)});
             
         });
     })
     .catch((err) => {
         console.log(err);
     })
}