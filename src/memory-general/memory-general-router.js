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

    .route('/high_scores')
    .get((req, res, next) => {
        MemoryGeneralService.getHighScores(req.app.get('db'))
        .then(scores => {
            res.json(scores)
        })
    })

module.exports=generalRouter;