const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

const itemName = 'leader';
const itemsName = 'leaders';

leaderRouter
  .route('/')
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
  })
  .get((req, res, next) => {
    res.end(`Will send all the ${itemsName} to you!`);
  })
  .post((req, res, next) => {
    res.end(`Will add the ${itemName} ${req.body.name} ${req.body.description}`)
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT is not supported on ${itemsName}`)
  })
  .delete((req, res, next) => {
    res.end(`Deleting all the ${itemsName}!`)
  })

leaderRouter
  .route(`/:${itemName}Id`)
  .get((req, res, next) => {
    res.end(`Will send a ${itemName} ${req.params.leaderId}`);
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end(`POST is not supported on /${itemsName}/:${itemName}Id`)
  })
  .put((req, res, next) => {
    res.end(`Will update the ${itemName} ${req.params.leaderId}`)
  })
  .delete((req, res, next) => {
    res.end(`Will delete the ${itemName} ${req.params.leaderId}`)
  })

module.exports = leaderRouter;