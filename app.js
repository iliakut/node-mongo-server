const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

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
app.use(cookieParser());

function auth(req, res, next) {
  console.log(req.headers);

  const authHeaders = req.headers.authorization;

  if (!authHeaders) {
    const err = new Error('You are not authenticated');

    res.setHeader('WWW-Authenticate', 'Basic');
    err.status = 401;
    next(err);
  }

  const auth = new Buffer(authHeaders.split(' ')[1], 'base64')
    .toString()
    .split(':');

  const username = auth[0];
  const password = auth[1];

  if (username === 'admin' && password === 'password') {
    next();
  } else {
    const err = new Error('You are not authenticated');

    res.setHeader('WWW-Authenticate', 'Basic');
    err.status = 401;
    next(err);
  }
}

app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRoutes);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

var listener = app.listen(3000, function () {
  console.log('Listening on port ' + listener.address().port)
})