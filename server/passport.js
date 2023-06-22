const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

var opts = {}
opts.jwtFromRequest = function(req) { 
    console.log(req)// tell passport to read JWT from cookies
    var token = null;
    if (req && req.cookies){
        token = req.cookies['jwt']
    }
    return token
}
opts.secretOrKey = "secret"

function CheckUser(u){
    console.log(u)
}

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log("JWT BASED AUTH GETTING CALLED") // called everytime a protected URL is being served
    if (CheckUser(jwt_payload.data)) {
        return done(null, jwt_payload.data)
    } else {
        // user account doesnt exists in the DATA
        return done(null, false)
    }
}))

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: "/auth/google/callback",
			scope: ["profile", "email"],
		},
		function (accessToken, refreshToken, profile, callback) {
            // console.log(profile)
            // console.log(callback)
			callback(null, profile);
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});
