const request = require('supertest')
const app = require('./../app')
const { globalSetup, globalTeardown } = require('./../serverSetup')
const { dropDB } = require('./../config/db')

// AUTH
const email = 'email@company.com'
const password = 'password'
let token

// AUTHOR
const firstName = 'John'
const lastName = 'Doe'
let authorId

// SOURCE
const resource = 'A book title'
let authors = [authorId]
let sourceId

// ENTRY
let entry = 'this is my first entry'
let entryId

beforeAll(async done => {
  await globalSetup()
  done()
})

// CREATE ACCOUNT
describe('Creates Account', () => {
  test('It should create a new account', done => {
    request(app)
      .post('/api/users')
      .send({
        name: 'joe',
        password: password,
        email: email,
      })
      .end((err, response) => {
        expect(response.statusCode).toBe(200)
        done()
      })
  })
})

describe('Logs User Out', () => {
  test('It should log user out', done => {
    token = ''
    request(app)
      .post('/api/authors')
      .set('x-auth-token', token)
      .send({
        firstName: firstName,
        lastName: lastName,
      })
      .then(response => {
        expect(response.statusCode).toBe(401)
        done()
      })
  })
})

describe('Logs User In', () => {
  test('It should log user in', done => {
    token = ''
    request(app)
      .post('/api/auth')
      .send({
        password: password,
        email: email,
      })
      .then(response => {
        // saves token
        token = JSON.parse(response.text).token
        expect(response.statusCode).toBe(200)
        done()
      })
  })
})

describe('Adds an Author', () => {
  test('It should require Authorization', done => {
    request(app)
      .post('/api/authors')
      .then(response => {
        expect(response.statusCode).toBe(401)
        done()
      })
  })
  test('It should post new author', done => {
    request(app)
      .post('/api/authors')
      .set('x-auth-token', token)
      .send({
        firstName: firstName,
        lastName: lastName,
      })
      .then(response => {
        authorId = JSON.parse(response.text)._id
        authors = [authorId]
        expect(response.statusCode).toBe(200)
        done()
      })
  })
})

describe('Retreive an author by ID', () => {
  test('It should require Authorization', done => {
    request(app)
      .get(`/api/authors/${authorId}`)
      .then(response => {
        expect(response.statusCode).toBe(401)
        done()
      })
  })
  test('It should retreive author by ID', done => {
    request(app)
      .get(`/api/authors/${authorId}`)
      .set('x-auth-token', token)
      .then(response => {
        const res = JSON.parse(response.text).firstName
        expect(res).toBe(firstName)
        done()
      })
  })
})

describe('Gets all authors', () => {
  test('It should require Authorization', done => {
    request(app)
      .get('/api/authors')
      .then(response => {
        expect(response.statusCode).toBe(401)
        done()
      })
  })
  test('It should get all authors', done => {
    request(app)
      .get('/api/authors')
      .set('x-auth-token', token)
      .then(response => {
        const authors = JSON.parse(response.text)
        expect(Array.isArray(authors)).toBe(true)
        expect(authors.length).toBe(1)
        done()
      })
  })
})

describe('Adds a Source', () => {
  test('It should require Authorization', done => {
    request(app)
      .post('/api/sources')
      .then(response => {
        expect(response.statusCode).toBe(401)
        done()
      })
  })
  test('It should post new source', done => {
    request(app)
      .post('/api/sources')
      .set('x-auth-token', token)
      .send({
        resource: resource,
        authors: authors,
      })
      .then(response => {
        sourceId = JSON.parse(response.text)._id
        expect(response.statusCode).toBe(200)
        done()
      })
  })
})

describe('Retreive a Source by ID', () => {
  test('It should require Authorization', done => {
    request(app)
      .get(`/api/sources/${sourceId}`)
      .then(response => {
        expect(response.statusCode).toBe(401)
        done()
      })
  })
  test('It should retreive source by ID', done => {
    request(app)
      .get(`/api/sources/${sourceId}`)
      .set('x-auth-token', token)
      .then(response => {
        const res = JSON.parse(response.text).resource
        expect(res).toBe(resource)
        done()
      })
  })
})

describe('Gets all sources', () => {
  test('It should require Authorization', done => {
    request(app)
      .get('/api/sources')
      .then(response => {
        expect(response.statusCode).toBe(401)
        done()
      })
  })
  test('It should get all sources', done => {
    request(app)
      .get('/api/sources')
      .set('x-auth-token', token)
      .then(response => {
        const sources = JSON.parse(response.text)
        expect(Array.isArray(sources)).toBe(true)
        expect(authors.length).toBe(1)
        done()
      })
  })
})

describe('Adds an Entry', () => {
  test('It should require Authorization', done => {
    request(app)
      .post('/api/entries')
      .then(response => {
        expect(response.statusCode).toBe(401)
        done()
      })
  })
  test('It should post new entry', done => {
    request(app)
      .post('/api/entries')
      .set('x-auth-token', token)
      .send({
        entry: entry,
      })
      .then(response => {
        entryId = JSON.parse(response.text)._id
        expect(response.statusCode).toBe(200)
        done()
      })
  })
})

describe('Retreive an Entry by ID', () => {
  test('It should require Authorization', done => {
    request(app)
      .get(`/api/entries/${entryId}`)
      .then(response => {
        expect(response.statusCode).toBe(401)
        done()
      })
  })
  test('It should retreive an entry by ID', done => {
    request(app)
      .get(`/api/entries/${entryId}`)
      .set('x-auth-token', token)
      .then(response => {
        const res = JSON.parse(response.text).entry
        expect(res).toBe(entry)
        done()
      })
  })
})

describe('Gets all entries', () => {
  test('It should require Authorization', done => {
    request(app)
      .get('/api/entries')
      .then(response => {
        expect(response.statusCode).toBe(401)
        done()
      })
  })
  test('It should get all entries', done => {
    request(app)
      .get('/api/entries')
      .set('x-auth-token', token)
      .then(response => {
        const entries = JSON.parse(response.text)
        expect(Array.isArray(entries)).toBe(true)
        expect(entries.length).toBe(1)
        done()
      })
  })
})

afterAll(async done => {
  await dropDB()
  await globalTeardown()
  done()
})
