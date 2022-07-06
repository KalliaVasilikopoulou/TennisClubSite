const session = require("express-session");

let currentSession = 

    session({
        name: process.env.SESSION_SECRET,
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie:{ 
            maxAge: 1000*60*60, //cookie lasts for an hour
            sameSite: true,
        }
    })

module.exports = currentSession;