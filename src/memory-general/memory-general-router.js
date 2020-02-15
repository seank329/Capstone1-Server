'use strict';

const express = require('express')
const MemoryGeneralService = require('./memory-general-service')
const path = require('path')

const generalRouter = express.Router();
const jsonBodyParser = express.json();

generalRouter
    .route('/')
    .get((req, res, next) => {
        MemoryGeneralService.getAllPlayers(req.app.get('db'))
        .then(names => {
            res.json(names.map(MemoryGeneralService.serializeNames))
        })
    })
 
    .post(jsonBodyParser, (req, res, next) => {
        const { player_name, total_time_played } = req.body
        const name = { player_name, total_time_played }
        MemoryGeneralService.postPlayer(req.app.get('db'), name)
            .then(name => {
                res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${name.player_id}`))
                .json(MemoryGeneralService.serializeNames(name))
            })
        .catch(next)
    })

generalRouter
    .route('/games_played/:id')
    .get((req, res, next) => {
        MemoryGeneralService.updatePlayerGameTotal(req.app.get('db'), req.params.id)
    })

generalRouter
    .route('/setup/:id')    
    .get((req, res, next) => {
        MemoryGeneralService.setPlayerInitialStats(req.app.get('db'), req.params.id)
    })

generalRouter
    .route('/total_time')
    .post(jsonBodyParser,(req, res, next) => {
        const { total_time_played , player_id } = req.body
        MemoryGeneralService.updateTimePlayed(req.app.get('db'), total_time_played, player_id)
        .then(data => {
            res.status(201)
        })
        .catch(next)
    })

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

generalRouter
    .route('/player_stats/:player')
    .get((req,res,next) => {
        const player_name = req.params.player
        MemoryGeneralService.getPlayerStats(req.app.get('db'), player_name)
        .then(data =>{
            res.json(data)
        })
        .catch(next)
    })

generalRouter
    .route('/high_scores/beginner')
    .get((req,res,next) => {
        MemoryGeneralService.getHighScoresBeginner(req.app.get('db'))
        .then(data =>{
            res.json(data)
        })
        .catch(next)
    })

generalRouter
    .route('/high_scores/easy')
    .get((req,res,next) => {
        MemoryGeneralService.getHighScoresEasy(req.app.get('db'))
        .then(data =>{
            res.json(data)
        })
        .catch(next)
    })

generalRouter
    .route('/high_scores/medium')
    .get((req,res,next) => {
        MemoryGeneralService.getHighScoresMedium(req.app.get('db'))
        .then(data =>{
            res.json(data)
        })
        .catch(next)
    })

generalRouter
    .route('/high_scores/hard')
    .get((req,res,next) => {
        MemoryGeneralService.getHighScoresHard(req.app.get('db'))
        .then(data =>{
            res.json(data)
        })
        .catch(next)
    })

generalRouter
    .route('/high_scores/expert')
    .get((req,res,next) => {
        MemoryGeneralService.getHighScoresExpert(req.app.get('db'))
        .then(data =>{
            res.json(data)
        })
        .catch(next)
    })

    // .route('/high_scores')
    // .get((req, res, next) => {
    //     MemoryGeneralService.getHighScores(req.app.get('db'))
    //     .then(scores => {
    //         res.json(scores)
    //     })
    //     .catch(next)
    // })

module.exports=generalRouter;