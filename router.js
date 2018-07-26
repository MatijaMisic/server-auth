const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignin = passport.authenticate('local', {session:false});

module.exports = function (app) {
    app.get('/', requireAuth, (req, res) => {
        res.send(req.user);
    })
    app.post('/signup', Authentication.signup);    
    app.post('/signin', requireSignin, Authentication.signin);
    app.get('/confirmation/:token', Authentication.emailConfirmation);
}