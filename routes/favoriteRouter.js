const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate')
const cors = require('./cors')
const Favourites = require('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter
  .route('/')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    const userId = req.user._id;
    Favourites.find({ user: userId })
      .populate('dishes')
      .then(favourites => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favourites)
      }, err => next(err))
      .catch(err => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    const userId = req.user._id;
    const dishesIds = req.body.map(dish => dish._id)
    Favourites.find({ user: userId })
      .then(favorite => {
        if (!favorite.length) {
          // create Favorite
          Favourites.create({
            user: userId,
            dishes: dishesIds
          })
            .then(favorite => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(favorite)
            })
            .catch(err => next(err))
        } else {
          // update favorite
          const favoriteOne = favorite[0];
          dishesIds.forEach(newDishId => {
            if (!favoriteOne.dishes.includes(newDishId)) {
              favoriteOne.dishes.push(newDishId);
            }
          })
          favoriteOne.save()
          .then(favorite => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite)
          })
          .catch(err => next(err))
        }
    })
      .catch(err => next(err))

    // Favourites.create({
    //   user: userId,
    //   dishes: dishesIds
    // })
    //   .then(favorite => {
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type', 'application/json');
    //     res.json(favorite)
    //   })
    //   .catch(err => next(err))
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT is not supported')
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    const userId = req.user._id;
    Favourites.remove({ user: userId })
      .then(resp => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp)
      }, err => next(err))
      .catch(err => next(err))
  })

favoriteRouter
  .route('/:dishId')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .get(cors.cors, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET is not supported')
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    const dishId = req.params.dishId;
    const userId = req.user._id;
    if (dishId) {
      Favourites.find({ user: userId })
        .then(favorite => {
          if (!favorite.length) {
            // create Favorite
            Favourites.create({
              user: userId,
              dishes: [dishId]
            })
              .then(favorite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite)
              })
              .catch(err => next(err))
          } else {
            // update favorite
            const favoriteOne = favorite[0];
            if (!favoriteOne.dishes.includes(dishId)) {
              favoriteOne.dishes.push(dishId);
              favoriteOne.save()
                .then(favorite => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(favorite)
                })
                .catch(err => next(err))
            } else {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(favorite)
            }
          }
        })
        .catch(err => next(err))
    }
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT is not supported')
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    const dishId = req.params.dishId;
    const userId = req.user._id;

    Favourites.find({ user: userId })
      .then(favorites => {
        if (favorites.length) {
          const favorite = favorites[0];
          favorite.dishes = favorite.dishes.filter(dishIdFromDB => {
            console.log(dishIdFromDB, dishId, !dishIdFromDB.equals(dishId))
            return !dishIdFromDB.equals(dishId)
          })
          favorite.save()
            .then(newFavorite => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(newFavorite)
            })
        }
      })
  })


module.exports = favoriteRouter;