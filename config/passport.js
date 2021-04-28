const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mysql = require('mysql');
const bcrypt = require('bcryptjs');

const db = require('./db');

module.exports = function(){
    passport.use(new LocalStrategy(
    // 這是 verify callback
    async function (username, password, done) {
        results = await db.login(username);
        console.log(results);
        console.log(results[0].username);
        if (!results){
            console.log("results"+results);
            console.log("usernameerror")
            return done(null, false, { message: 'Incorrect username.' });
        }
        bcrypt.compare(password, results[0].pwd, function(err, res) {
            
             res == true;
             console.log(res);
             if( res == true){
                return done(null, results);
             }
             else{
                return done(null, false, { message: 'Incorrect password.' });
             }
        });
      
        //result = results[0].username;
    }
    ));
}