const express = require('express')
const path = require('path')
const UsersService = require('./user-service')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

/*
    The 'usersRouter' handles routing related to creation of a new user, as well as the retrieval of a user's
    id.
*/
usersRouter
.post('/', jsonBodyParser, (req, res, next) => {
    const { player_name, password} = req.body

    for (const field of ['player_name', 'password'])
    if(!req.body[field])
      return res.status(400).json({
          error: `Missing '${field}' in request body` 
      })

      const passwordError = UsersService.validatePassword(password)

      if(passwordError)
          return res.status(400).json({ error : passwordError })

      UsersService.hasUserWithUserName(
          req.app.get('db'),
          player_name
      )
          .then(hasUserWithUserName => {
              if(hasUserWithUserName){
                  return res.status(400).json({ error: `Username already taken` })
              }
              return UsersService.hashPassword(password)
                      .then(hashedPassword => {
              const newUser = {
                  player_name,
                  password: hashedPassword,
                  player_created: 'now()',
              }
              return UsersService.insertUser(
                  req.app.get('db'),
                  newUser
              )
                  .then(user => {
                      res 
                          .status(201)
                          .location(path.posix.join(req.originalUrl, `/${user.id}`))
                          .json(UsersService.serializeUser(user))
                  })
              })
          })
          .catch(next)
})

module.exports = usersRouter