const express = require('express');
const morgan = require('morgan');
const path = require('path');
const handlebars = require('express-handlebars');

const route = require('./routes');
// Authentication Packages
const session = require('express-session');
const passport = require('./config/passport');

const app = express();
const port = 3000;

//for parsing application/x-www-form-urlencoded
app.use(
  express.urlencoded({
      extended: true,
  }),
);

//Add static folder
app.use(express.static(path.join(__dirname, 'public')));

//HTTP logger
app.use(morgan('combined'));

//Template Engine
app.engine('hbs', handlebars({
    extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/resources/views'));

//Express Session
app.use(session({
  secret: 'ansckansclahicqwunak',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 }
}));

//Use Passport
app.use(passport.initialize());
app.use(passport.session());


//Route init
route(app);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})