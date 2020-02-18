'use strict';

const express = require('express')
const cors = require('cors')
const MemoryGeneralService = require('./memory-general-service')
const { requireAuth } = require('../middleware/jwt-auth')

const generalRouter = express.Router();
const jsonBodyParser = express.json();


/*
    The 'generalRouter' handles all routes which requires resources located in the 'memory' for anything other
    than authentication.
*/

// Route for getting high scores - beginner level

// generalRouter.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "https://memory-app-sigma.now.sh"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });

generalRouter
    .route('/high_scores/beginner')
    .get((req,res,next) => {
        MemoryGeneralService.getHighScoresBeginner(req.app.get('db'))
        .then(data =>{
            res.json(data)
        })
        .catch(next)
    })

// Route for getting high scores - easy level
generalRouter
    .route('/high_scores/easy')
    .get((req,res,next) => {
        MemoryGeneralService.getHighScoresEasy(req.app.get('db'))
        .then(data =>{
            res.json(data)
        })
        .catch(next)
    })

// Route for getting high scores - medium level
generalRouter
    .route('/high_scores/medium')
    .get((req,res,next) => {
        MemoryGeneralService.getHighScoresMedium(req.app.get('db'))
        .then(data =>{
            res.json(data)
        })
        .catch(next)
    })

// Route for getting high scores - hard level     
generalRouter
    .route('/high_scores/hard')
    .get((req,res,next) => {
        MemoryGeneralService.getHighScoresHard(req.app.get('db'))
        .then(data =>{
            res.json(data)
        })
        .catch(next)
    })

// Route for getting high scores - expert level    
generalRouter
    .route('/high_scores/expert')
    .get((req,res,next) => {
        MemoryGeneralService.getHighScoresExpert(req.app.get('db'))
        .then(data =>{
            data ? res.json(data) : res.status(404)
        })
        .catch(next)
    })

// Route for updating total games played
generalRouter
    .use(requireAuth)
    .route('/games_played/:id')
    .get((req, res, next) => {
        MemoryGeneralService.updatePlayerGameTotal(req.app.get('db'), req.params.id)
    })

// Route for setting default stats of 0 for a new player
generalRouter
    .route('/setup/:id')    
    .get((req, res, next) => {
        MemoryGeneralService.setPlayerInitialStats(req.app.get('db'), req.params.id)
    })

// Route for updating the total time played
generalRouter
    .route('/total_time')
    .post(jsonBodyParser,(req, res, next) => {
        const { total_time_played , player_id } = req.body
        MemoryGeneralService.updateTimePlayed(req.app.get('db'), total_time_played, player_id)
        .then(data => {
            data ? res.status(201).json(data) : res.status(404)
        })
        .catch(next)
    })

// Route for getting the quickest times for each level
generalRouter
    .route('/get_quickest_time/:id/:level')
    .get((req,res,next) => {
        const player_id = req.params.id
        const level = req.params.level
        MemoryGeneralService.getTimeForLevel(req.app.get('db'), player_id, level)
        .then(data =>{
            res.json(data)
        })
        .catch(next)
    })

// Route for posting the the quickest game. Works for each experience level
generalRouter
    .route('/post_quickest')
    .post(jsonBodyParser,(req, res, next) => {
        const { player_id, experience, quickest_time } = req.body
        MemoryGeneralService.postQuickest(req.app.get('db'), player_id, experience, quickest_time)
        .then(data => {
            res.status(201)
        })
        .catch(next)
    })

// Route for getting player statistics
generalRouter
    .route('/player_stats/:player')
    .get((req,res,next) => {
        const player_name = req.params.player
        MemoryGeneralService.getPlayerStats(req.app.get('db'), player_name)
        .then(data =>{
            data ? res.status(201).json(data) : res.status(404)
        })
        .catch(next)
    })


module.exports=generalRouter;