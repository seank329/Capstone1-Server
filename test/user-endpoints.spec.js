const bcrypt = require('bcryptjs')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('User Endpoints', function () {
  let db

  const testUsers = helpers.makeUsersArray()
  const testUser = testUsers[0]

  before('make knex instance', () => {
    db = helpers.makeKnexInstance()
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  /**
   * @description Register a user and populate their fields
   **/
  describe(`POST /api/users`, () => {
    beforeEach('insert users', () => helpers.seedUsers(db, testUsers))

    const requiredFields = ['player_name', 'password']

    requiredFields.forEach(field => {
      const registerAttemptBody = {
        player_name: 'test username',
        password: 'test password',
      }

      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete registerAttemptBody[field]

        return supertest(app)
          .post('/api/users')
          .send(registerAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          })
      })
    })

    it(`responds 400 'Password must be longer than 8 characters' when empty password`, () => {
      const userShortPassword = {
        player_name: 'test username',
        password: '1234567',
      }
      return supertest(app)
        .post('/api/users')
        .send(userShortPassword)
        .expect(400, { error: `Password must be longer than 8 characters` })
    })

    it(`responds 400 'Password must be less than 72 characters' when long password`, () => {
      const userLongPassword = {
        player_name: 'test username',
        password: '*'.repeat(73),
      }
      return supertest(app)
        .post('/api/users')
        .send(userLongPassword)
        .expect(400, { error: `Password must be less than 72 characters` })
    })

    it(`responds 400 error when password starts with spaces`, () => {
      const userPasswordStartsSpaces = {
        player_name: 'test username',
        password: ' 1Aa!2Bb@',
      }
      return supertest(app)
        .post('/api/users')
        .send(userPasswordStartsSpaces)
        .expect(400, { error: `Password must not start or end with empty spaces` })
    })

    it(`responds 400 error when password ends with spaces`, () => {
      const userPasswordEndsSpaces = {
        player_name: 'test username',
        password: '1Aa!2Bb@ ',
      }
      return supertest(app)
        .post('/api/users')
        .send(userPasswordEndsSpaces)
        .expect(400, { error: `Password must not start or end with empty spaces` })
    })

    it(`responds 400 error when password isn't complex enough`, () => {
      const userPasswordNotComplex = {
        player_name: 'test username',
        password: '11AAaabb',
      }
      return supertest(app)
        .post('/api/users')
        .send(userPasswordNotComplex)
        .expect(400, { error: `Password must contain 1 upper case, lower case, number and special character` })
    })

    it(`responds 400 'User name already taken' when username isn't unique`, () => {
      const duplicateUser = {
        player_name: testUser.player_name,
        password: '11AAaa!!',
      }
      return supertest(app)
        .post('/api/users')
        .send(duplicateUser)
        .expect(400, { error: `Username already taken` })
    })

    describe(`Given a valid user`, () => {
      it(`responds 201, serialized user with no password`, () => {
        const newUser = {
          player_name: 'test username',
          password: '11AAaa!!',
        }
        return supertest(app)
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property('id')
            expect(res.body.player_name).to.eql(newUser.player_name)
            expect(res.body).to.not.have.property('password')
            expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
          })
      })

      it(`stores the new user in db with bcryped password`, () => {
        const newUser = {
          player_name: 'test username',
          password: '11AAaa!!',
        }
        return supertest(app)
          .post('/api/users')
          .send(newUser)
          .expect(res =>
            db
              .from('memory_user')
              .select('*')
              .where({ id: res.body.id })
              .first()
              .then(row => {
                expect(row.player_name).to.eql(newUser.player_name)
                return bcrypt.compare(newUser.password, row.password)
              })
              .then(compareMatch => {
                expect(compareMatch).to.be.true
              })
          )
      })
    })
})
})