const request = require('supertest')
const app = require('./../app')
const { globalSetup, globalTeardown } = require('./../serverSetup')
const { dropDB } = require('./../config/db')

// AUTH
const email = 'email@company.com'
const password = 'password'
//let token

// RESOURCE
const resource = 'A book made for testing'
const editedResource = 'A book made for editing'
const authorLastName = 'Best Selling'

beforeAll(async done => {
  await globalSetup()
  done()
})

// CREATE ACCOUNT
describe('Creates Account and logs user in to create new source', () => {
  let token
  let sourceNoAuthorId
  let sourcesNoAuthor
  let sourceWithAuthorId
  let sourcesWithAuthor
  beforeAll(done => {
    request(app)
      .post('/api/users')
      .send({
        name: 'joe',
        password: password,
        email: email,
      })
      .then(response => {
        token = JSON.parse(response.text).token
        done()
      })
  })
  test('It should require Authorization', done => {
    request(app)
      .post('/api/sources')
      .send({
        resource: resource,
      })
      .then(response => {
        expect(response.statusCode).toBe(401)
        done()
      })
  })

  test('It should post new source with no author', done => {
    request(app)
      .post('/api/sources')
      .set('x-auth-token', token)
      .send({
        resource: resource,
      })
      .then(response => {
        sourceNoAuthorId = JSON.parse(response.text)._id
        sourcesNoAuthor = [sourceNoAuthorId]
        expect(response.statusCode).toBe(200)
        done()
      })
  })
  test('It should retreive source by ID with no author', done => {
    request(app)
      .get(`/api/sources/${sourceNoAuthorId}`)
      .set('x-auth-token', token)
      .then(response => {
        const res = JSON.parse(response.text)
        expect(res.resource).toBe(resource)
        expect(res.authors.length).toBe(0)
        done()
      })
  })
  test('It should post new source with author', done => {
    request(app)
      .post('/api/sources')
      .set('x-auth-token', token)
      .send({
        resource: resource,
        authorLastName: authorLastName,
      })
      .then(response => {
        sourceWithAuthorId = JSON.parse(response.text)._id
        sourcesWithAuthor = [sourceWithAuthorId]
        expect(response.statusCode).toBe(200)
        done()
      })
  })
  test('It should retreive source by ID with author', done => {
    request(app)
      .get(`/api/sources/${sourceWithAuthorId}`)
      .set('x-auth-token', token)
      .then(response => {
        const res = JSON.parse(response.text)
        expect(res.resource).toBe(resource)
        expect(res.authors.length).toBeGreaterThan(0)
        done()
      })
  })
  test('It should edit a source by ID', done => {
    request(app)
      .post(`/api/sources/`)
      .set('x-auth-token', token)
      .send({
        resource: editedResource,
        _id: sourceWithAuthorId,
      })
      .then(response => {
        const res = JSON.parse(response.text)
        expect(res.resource).toBe(editedResource)
        done()
      })
  })
})

afterAll(async done => {
  await dropDB()
  await globalTeardown()
  done()
})
