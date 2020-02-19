'use strict';
require ('dotenv').config()
const express = require('express')
const AuthService = require('./auth-service')

const authRouter = express.Router()
const jsonBodyParser = express.json()

const {requireAuth} = require('../middleware/jwt-auth')

authRouter
 .post('/login', jsonBodyParser, (req, res, next) => {
    const { player_name, password } = req.body
    const loginPlayer = { player_name, password }
    
    for (const field of ['player_name', 'password'])
    if(!req.body[field])
      return res.status(400).json({
          error: `Missing '${field}' in request body` 
      })
    AuthService.getUserWithUserName(
      req.app.get('db'),
      loginPlayer.player_name
    )
      .then(dbUser => {
        if (!dbUser)
          return res.status(400).json({
            error: 'Incorrect player_name or password',
          })
        return AuthService.comparePasswords(loginPlayer.password, dbUser.password)
          .then(compareMatch => {
            if(!compareMatch)
              return res.status(400).json({
                error: `Incorrect player_name or password`
              })
            const sub = dbUser.player_name;
            const payload = { player_id: dbUser.id }
            res.send({
              authToken: AuthService.createJwt(sub, payload),
              id:dbUser.id
            })
          })   
      })
      .catch(next)
  })

authRouter.post('/refresh', requireAuth, (req, res) => {
    const sub = req.user.player_name
    const payload = { id: req.user.id }
    res.send({
      authToken: AuthService.createJwt(sub, payload),
    })
  })


module.exports = authRouter