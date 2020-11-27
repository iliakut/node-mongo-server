const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Promotions = require('../models/promotions');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter
  .route('/')
  .get((req, res, next) => {
    Promotions.find({})
      .then(leaders => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders)
      }, err => next(err))
      .catch(err => next(err));
  })
  .post((req, res, next) => {
    Promotions.create(req.body)
      .then(promotion => {
        console.log('Promotion created', promotion);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion)
      }, err => next(err))
      .catch(err => next(err))
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT is not supported on promotion')
  })
  .delete((req, res, next) => {
    Promotions.remove({})
      .then(resp => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp)
      }, err => next(err))
      .catch(err => next(err))
  })


promoRouter
  .route('/:promoId')
  .get((req, res, next) => {
    Promotions.findById(req.params.promoId)
      .then(leader => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader)
      }, err => next(err))
      .catch(err => next(err))

  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST is not supported on /promotions/:promoId')
  })
  .put((req, res, next) => {
    Promotions.findByIdAndUpdate(req.params.promoId, {
      $set: req.body
    }, { new: true })
      .then(leader => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader)
      }, err => next(err))
      .catch(err => next(err))
  })
  .delete((req, res, next) => {
    Promotions.findByIdAndRemove(req.params.promoId)
      .then(leader => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader)
      }, err => next(err))
      .catch(err => next(err))
  })


module.exports = promoRouter;