const xss = require('xss');
const bcrypt = require('bcryptjs');
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

/*
  The UsersService hanndles all database transactions relating to registering new users.
*/
const UsersService = {
    // Player's must have a unique player_name. Checks database for an identical name to deny reg request if necessary
    hasUserWithUserName(db, player_name) {
        return db('memory_user')
            .where({ player_name })
            .first()
            .then(user => !!user)
    },
    // Insert a user into the database upon successful registration
    insertUser(db, newPlayer) {
        return db   
            .insert(newPlayer)
            .into('memory_user')
            .returning('*')
            .then(([player]) => player)
    },
    // Makes sure password creation is within required specifications
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
    // Hash password with bcrypt
    hashPassword(password){
        return bcrypt.hash(password, 12)
    },
    // Prevents XSS attack
    serializeUser(user){
        return{
            id:user.id,
            player_name: xss(user.player_name),
            player_created: new Date(user.date_created)
        }
    },
  }
  
  module.exports = UsersService;