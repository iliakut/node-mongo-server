const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const dishRoutes = require('./routes/dishRoutes');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');

const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect
  .then(db => {
    console.log('Connected correctly to Server')
  })
  .catch(err => {
    console.log(err)
  })

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser('12345-67890-09876-54321'));
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);

function auth(req, res, next) {
  //console.log(req.signedCookies);
  console.log(req.session);

  if (!req.session.user) { // !req.signedCookies.user
    const err = new Error('You are not authenticated');
    err.status = 401;
    return next(err);
  } else {
    if (req.session.user === 'authenticated') { // req.signedCookies.user === 'admin'
      next();
    } else {
      const err = new Error('You are not authenticated');

      err.status = 403;
      return next(err);
    }
  }
}

app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes', dishRoutes);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

var listener = app.listen(3000, function () {
  console.log('Listening on port ' + listener.address().port)
})