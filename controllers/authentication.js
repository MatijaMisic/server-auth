const jwt = require('jwt-simple');
const config = require('../config');
const User = require('../models/User');
const transporter = require('../services/mailer');

function tokenForUser(user){
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user._id, iat: timestamp }, config.secret);
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
         .then((user) => {           
            res.json({token: tokenForUser(user)});
            const token = tokenForUser(user);
            const url = 'http://localhost:3090/confirmation/'
            transporter.sendMail({
                from: config.emailSender,
                to: config.emailRecevier,
                subject: 'Please confirm your email',
                html:`Please confirm your email address by clicking on link: <a href="${url}${token}">${url}${token}</a>`
            }, (err, info) => {
                if(err) console.log(err);
                else console.log('Email sent: ' + info.response);          
            })
             
         });
     })
     .catch((err) => {
         console.log(err);
     })
}

exports.emailConfirmation = function(req, res, next){
    const decoded = jwt.decode(req.params.token, config.secret)
    User.findOne({_id:decoded.sub})
    .then((user) => {
        if(!user){
            return res.status(401).json('Email confirmation failed')
        }

        user.confirmAcc = true;
        user.save()
        .then((user) => {
         res.send(user)   
        })
    })
}