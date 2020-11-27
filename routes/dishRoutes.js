const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter
  .route('/')
  .get((req, res, next) => {
    res.end('Will send all the dishes to you!');
  })
  .post((req, res, next) => {
    res.end('Will add the dish ' + req.body.name + req.body.description)
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT is not supported on dishes')
  })
  .delete((req, res, next) => {
    res.end('Deleting all the dishes!')
  })

dishRouter
  .route('/:dishId')
  .get((req, res, next) => {
    res.end('Will send a dish ' + req.params.dishId);
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST is not supported on /dishes/:dishId')
  })
  .put((req, res, next) => {
    res.end('Will update the dish ' + req.params.dishId)
  })
  .delete((req, res, next) => {
    res.end('Will delete the dish ' + req.params.dishId)
  })

module.exports = dishRouter;