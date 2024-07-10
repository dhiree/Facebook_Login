const express = require('express');
const app = express();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const session = require('express-session');
require('dotenv').config();

app.set('view engine', 'ejs');
app.use(session({ secret: "this is my Secret.", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());


app.get('/', function (req, res) {
    res.render('index.ejs');
});


passport.use(new FacebookStrategy({
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "/facebook/callback",
    profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)', 'email'],
    clientID: process.env.CLIENT_ID,

},
    function (token, refreshToken, profile, done) {
        console.log(token, profile);
        process.nextTick(function () {
            return done(null, { profile, token });
        });
    }
));

app.get('/auth/facebook', (req, res) => {
    const facebookAuthURL = `https://www.facebook.com/v3.2/dialog/oauth?response_type=code&redirect_uri=${encodeURIComponent('http://localhost:8080/facebook/callback')}&scope=email&client_id=${process.env.CLIENT_ID}&config_id=${process.env.CONFIG_ID}`;
    res.redirect(facebookAuthURL);
})

app.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/failed'
}));

app.get('/profile', isLoggedIn, async (req, res) => {
    try {
        const response = await fetch(`https://graph.facebook.com/me/accounts?access_token=${req.user.token}`);
        const pages = await response.json();
        console.log(JSON.stringify(pages))
        res.render('profile', { user: req.user.profile, pages: pages.data });
    } catch (error) {
        console.error('Error fetching user pages:', error);
        res.redirect('/failed');
    }
});

app.get('/page-insights/:pageId', isLoggedIn, async (req, res) => {
    const { since, until, period } = req.query;
    try {
        const pageId = req.params.pageId;
        const metrics = "page_fans,page_engaged_users,page_impressions,page_actions_post_reactions_like_total";
        const url = `https://graph.facebook.com/v14.0/${pageId}/insights?metric=${metrics}&since=${since}&until=${until}&period=${period}&access_token=${req.user.token}`;

        const response = await fetch(url);
        const insights = await response.json();

        if (insights.error) {
            console.error('Error fetching page insights:', insights.error.message);
            return res.status(500).json({ error: `Error fetching page insights: ${insights.error.message}` });
        }

        if (!insights.data) {
            console.error('Error: insights.data is undefined', insights);
            return res.status(500).json({ error: 'Error fetching page insights: insights.data is undefined' });
        }

        const totalFollowers = insights.data.find(item => item.name === 'page_fans')?.values[0]?.value || 0;
        const totalEngagement = insights.data.find(item => item.name === 'page_engaged_users')?.values[0]?.value || 0;
        const totalImpressions = insights.data.find(item => item.name === 'page_impressions')?.values[0]?.value || 0;
        const totalReactions = insights.data.find(item => item.name === 'page_actions_post_reactions_like_total')?.values[0]?.value || 0;

        res.json({
            total_followers: totalFollowers,
            total_engagement: totalEngagement,
            total_impressions: totalImpressions,
            total_reactions: totalReactions
        });

    } catch (error) {
        console.error('Error fetching page insights:', error);
        res.status(500).json({ error: 'Error fetching page insights' });
    }
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

app.get('/failed', (req, res) => {
    res.send('You are not a valid user');
});

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

app.listen(8080, () => {
    console.log('Server is listening on port 8080');
});




