const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

var userSchema = mongoose.Schema({
    uid: String,
    email: String,
    name: String,
    pic: String
});

module.exports = mongoose.model('user', userSchema)














///const express = require('express');
// const app = express();
// const passport = require('passport')
// const facebookStrategy = require('passport-facebook').Strategy
// const session = require('express-session')
// //const User = require('./models/User')

// app.set('view engine', 'ejs');

// app.use(passport.initialize())
// app.use(passport.session())
// app.use(session({ secret: "this is my secret" }))


// app.get('/', function (req, res) {
//     res.render('index.ejs');
// });

// passport.use(new facebookStrategy({
//     clientID: "",
//     clientSecret: "",
//     callbackURL: "",
//     profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)', 'email']

// },
//     function (token, refresToken, profile, done) {
//         console.lof(token)
//     }))


// app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }))
// app.get('/facebook/callback', passport.authenticate('facebook', {
//     successRedirect: '/profile',
//     failureRedirect: '/failed'
// }))
// app.get('/profile', isLoggedIn, (req, res) => {

//     res.render('profile', { user: req.user })
// })

// function isLoggedIn(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next()
//     }
//     res.redirect('/')
// }

// app.get('/failed', (req, res) => {
//     res.send('you are not vailed user')

// })

// passport.serializeUser(function (user, done) {
//     done(null, user)
// })

// passport.deserializeUser(function (id, done) {
//     return done(null, id)
// })




// app.listen(8080);
// console.log('Server is listening on port 8080');
