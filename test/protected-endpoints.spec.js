const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Protected Endpoints', function () {
  let db

  const testUsers = helpers.makeUsersArray()
  const [testUser] = testUsers

  before('make knex instance', () => {
    db = helpers.makeKnexInstance()
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  beforeEach('insert users', () => {
    return helpers.seedUsers(
      db,
      testUsers,
    )
  })

  const protectedEndpoints = [
    {
      name: 'GET /api/memory-general/games_played/:id',
      path: '/api/memory-general/games_played/:id',
      method: supertest(app).get,
    },
    {
      name: 'GET /api/memory-general/setup/:id',
      path: '/api/memory-general/setup/:id',
      method: supertest(app).get,
    },
    {
      name: 'POST /api/memory-general/total_time',
      path: '/api/memory-general/total_time',
      method: supertest(app).post,
    },
    {
      name: 'GET /api/memory-general/get_quickest_time/:id/:level',
      path: '/api/memory-general/get_quickest_time/:id/:level',
      method: supertest(app).get,
    },
    {
      name: 'POST /api/memory-general/post_quickest',
      path: '/api/memory-general/post_quickest',
      method: supertest(app).post,
    },
    {
      name: 'GET /api/memory-general/player_stats/:player',
      path: '/api/memory-general/player_stats/:player',
      method: supertest(app).get,
    },
  ]

  protectedEndpoints.forEach(endpoint => {
    describe(endpoint.name, () => {
      it(`responds 401 'Missing bearer token' when no bearer token`, () => {
        return endpoint.method(endpoint.path)
          .expect(401, { error: `Missing bearer token` })
      })

      it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
        const validUser = testUsers[0]
        const invalidSecret = 'not-a-good-secret'
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
          .expect(401, { error: `Unauthorized request` })
      })

      it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
        const invalidUser = { player_name: 'user-not0hya', id: 1 }
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(invalidUser))
          .expect(401, { error: `Unauthorized request` })
      })
    })
  })
})
