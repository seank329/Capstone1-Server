'use strict';

const express = require('express')
const AuthService = require('./auth-service')

const authRouter = express.Router()
const jsonBodyParser = express.json()

authRouter
 .post('/login', jsonBodyParser, (req, res, next) => {
    const { player_name, password } = req.body
    console.log(player_name)
    console.log(password)
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
            error: 'Incorrect user_name or password',
          })
        return AuthService.comparePasswords(loginPlayer.password, dbUser.password)
          .then(compareMatch => {
            if(!compareMatch)
              return res.status(400).json({
                error: `Incorrect user_name or password`
              })
            const sub = dbUser.player_name;
            const payload = { player_id: dbUser.id }
            res.send({
              authToken: AuthService.createJwt(sub, payload)
            })
          })
          
      })
      .catch(next)
  })

module.exports = authRouter