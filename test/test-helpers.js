const knex = require('knex')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

/**
 * create a knex instance connected to postgres
 * @returns {knex instance}
 */
function makeKnexInstance() {
  return knex({
    client: 'pg',
    connection: process.env.TEST_DB_URL,
  })
}

/**
 * create a knex instance connected to postgres
 * @returns {array} of user objects
 */
function makeUsersArray() {
  return [
    {
      id: 1,
      player_name: 'Test user 1',
      password: 'password',
    },
    {
      id: 2,
      player_name: 'Test user 2',
      password: 'password',
    },
  ]
}

/**
 * make a bearer token with jwt for authorization header
 * @param {object} user - contains `id`, `username`
 * @param {string} secret - used to create the JWT
 * @returns {string} - for HTTP authorization header
 */
function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ player_id: user.id }, secret, {
      subject: user.player_name,
      algorithm: 'HS256',
    })
    return `Bearer ${token}`
  }

  /**
 * insert users into db with bcrypted passwords and update sequence
 * @param {knex instance} db
 * @param {array} users - array of user objects for insertion
 * @returns {Promise} - when users table seeded
 */
function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
      ...user,
      password: bcrypt.hashSync(user.password, 1)
    }))
    return db.transaction(async trx => {
      await trx.into('memory_user').insert(preppedUsers)
  
      await trx.raw(
        `SELECT setval('memory_user_id_seq', ?)`,
        [users[users.length - 1].id],
      )
    })
  }

  /**
 * remove data from tables and reset sequences for SERIAL id fields
 * @param {knex instance} db
 * @returns {Promise} - when tables are cleared
 */
function cleanTables(db) {
    return db.transaction(trx =>
      trx.raw(
        `TRUNCATE
          "memory_general",
          "memory_user"`
        )
        .then(() =>
          Promise.all([
            trx.raw(`ALTER SEQUENCE memory_general_id_seq minvalue 0 START WITH 1`),
            trx.raw(`ALTER SEQUENCE memory_user_id_seq minvalue 0 START WITH 1`),
            trx.raw(`SELECT setval('memory_general_id_seq', 0)`),
            trx.raw(`SELECT setval('memory_user_id_seq', 0)`),
         
         
          ])
        )
    )
  }

function makeData(user) {
  
    const stats =[
        {
        id: 1,
        quickest_game_played_beginner: 0,
        quickest_game_played_easy: 0,
        quickest_game_played_medium: 0,
        quickest_game_played_hard: 0,
        quickest_game_played_expert: 0,
        total_time_played: 0,
        games_played: 0,
        player_id: user.id,
      },
      {
        id: 2,
        quickest_game_played_beginner: 0,
        quickest_game_played_easy: 0,
        quickest_game_played_medium: 0,
        quickest_game_played_hard: 0,
        quickest_game_played_expert: 0,
        total_time_played: 0,
        games_played: 0,
        player_id: user.id,
      },
    ]
  return stats

  }

  async function seedUsersStats(db, users, stats) {
    await seedUsers(db, users)
    await db.transaction(async trx => {
    await trx.into('memory_general').insert(stats)
    await Promise.all([
      // trx.raw(
      //   `SELECT setval('memory_general_id_seq', ?)`,
      //   [stats[stats.length - 1].id],
      // ),
      trx.raw(
        `SELECT setval('memory_user_id_seq', ?)`,
        [users[users.length - 1].id],
      ), 
      ])
  })
  }


module.exports = {
    makeKnexInstance,
    makeUsersArray,
    makeAuthHeader,
    seedUsers,
    cleanTables,
    makeData,
    seedUsersStats
}