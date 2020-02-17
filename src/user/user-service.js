const xss = require('xss')
const bcrypt = require('bcryptjs')
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
    hasUserWithUserName(db, player_name) {
        return db('memory_user')
            .where({ player_name })
            .first()
            .then(user => !!user)
    },
    getUserId(db, player_name){
      return db
              .select('id')
              .from('memory_user')
              .where({ player_name })
              .first()
    },
    insertUser(db, newPlayer) {
        return db   
            .insert(newPlayer)
            .into('memory_user')
            .returning('*')
            .then(([player]) => player)
    },
    validatePassword(password) {
      if (password.length < 8) {
        return 'Password must be longer than 8 characters'
      }
      if (password.length > 72) {
        return 'Password must be less than 72 characters'
      }
      if (password.startsWith(' ') || password.endsWith(' ')) {
          return 'Password must not start or end with empty spaces'
      }
      if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
        return 'Password must contain 1 upper case, lower case, number and special character'
      }
      return null
    },
    hashPassword(password){
        return bcrypt.hash(password, 12)
    },
    serializeUser(user){
        return{
            id:user.id,
            player_name: xss(user.player_name),
            player_created: new Date(user.date_created)
        }
    },
  }
  
  module.exports = UsersService