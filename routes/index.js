const express = require('express');
const router = express.Router();
const root = require('../path');

router.get('/', (req, res, next) => {
  //res.render('index', { title: 'Express' })
  res.sendFile(root + '/public/index.html');
});

module.exports = router;