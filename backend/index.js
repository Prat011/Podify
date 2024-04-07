const express = require('express');
const mongoose = require('mongoose');
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const authRoutes = require("./routes/auth");
const songRoutes = require("./routes/song");
const playlistRoutes = require("./routes/playlist");
const app = express();
const port = 8000;
app.use(express.json());

require("dotenv").config();
const uri = "mongodb+srv://prathit:"+process.env.MONGO_PASSWORD+"@cluster0.nbil5gv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(uri,
                        {
                            maxPoolSize: 50,
                            wtimeoutMS: 2500,
                            useNewUrlParser: true
                        }
                    ).then((x) => {
                        console.log("Connected to Mongo!");
                    })
                    .catch((err) => {
                        console.log("Error while connecting");
                    });


let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.sub}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));


app.get("/",(req, res)=>{
    res.send("Hello There yO");
});

app.use("/auth",authRoutes);
app.use("/song",songRoutes);

app.listen(port, ()=>{
    console.log("Running on port "+port);
});