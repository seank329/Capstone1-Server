'use strict';
require ('dotenv').config()
const express = require('express')
const MemoryGeneralService = require('./memory-general-service')
const generalRouter = express.Router();
const { requireAuth } = require('../middleware/jwt-auth')
const jsonBodyParser = express.json();

/*
    The 'generalRouter' handles all routes which requires resources located in the 'memory' for anything other
    than authentication.
*/

// Route for getting all high scores
generalRouter
    .route('/experience/:level')
    .get((req, res, next) => {
        MemoryGeneralService.getHighScores(req.app.get('db'), req.params.level)
        .then(data =>{
            res.json(data)
        })
        .catch(next)
    })

// Route for getting, posting, and updating player data
generalRouter
    .route('/:id')
    .get(requireAuth, (req,res,next) => {
        MemoryGeneralService.getPlayerStats(req.app.get('db'), req.params.id)
        .then(data => {
            data ? res.status(200).json(data) : res.status(404)
        })
        .catch(next)
    })
    .post((req, res, next) => {
        MemoryGeneralService.setPlayerInitialStats(req.app.get('db'), req.params.id)
        .then(data => {
            data ? res.status(201).json(data) : res.status(404)
        })
        .catch(next)
    })
    .put(jsonBodyParser,(req, res, next) => {
        const { player_id, experience, total_time_played, is_quickest } = req.body
        MemoryGeneralService.postTimes(req.app.get('db'), player_id, experience, total_time_played, is_quickest)
        .then(data => {
            data? res.status(200).json(data) :res.status(404)
        })
        .catch(next)
    })

    module.exports=generalRouter;