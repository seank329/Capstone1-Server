'use strict';
require ('dotenv').config();
const express = require('express');
const path = require('path');
const MemoryGeneralService = require('./memory-general-service');
const generalRouter = express.Router();
const { requireAuth } = require('../middleware/jwt-auth');
const jsonBodyParser = express.json();

/*
    The 'generalRouter' handles all routes which requires resources located in the 'memory' for anything other
    than authentication.
*/

// Route for getting all high scores
generalRouter
    .route('/experience/:level')
    .get(async (req, res, next) => {
        await MemoryGeneralService.getHighScores(req.app.get('db'), req.params.level)
        .then(data =>{
            res.json(data)
        })
        .catch(next)
    })

// Route for getting, posting, and updating player data
generalRouter
    .use(requireAuth)       // Authorization required from this point forward

generalRouter
    .route('/player/:id')
    .get(async (req,res,next) => {          // GET Player-specific statistics
        await MemoryGeneralService.getPlayerStats(req.app.get('db'), req.params.id)
        .then(data => {
            data ? res.status(200).json(data) : res.status(404)
        })
        .catch(next)
    })
    .post(async (req, res, next) => {       // POST Player-specific statistics
        await MemoryGeneralService.setPlayerInitialStats(req.app.get('db'), req.params.id)
        .then(data => {
            res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${req.params.id}`))
                .json()
        })
        .catch(next)
    })
    .put(jsonBodyParser, async (req, res, next) => {    // PUT (Update) Player-specific statistics
        const { player_id, experience, total_time_played, is_quickest } = req.body
        await MemoryGeneralService.postTimes(req.app.get('db'), player_id, experience, total_time_played, is_quickest)
        .then(data => {
            data? res.status(200).json(data) :res.status(404)
        })
        .catch(next)
    })

    module.exports=generalRouter;