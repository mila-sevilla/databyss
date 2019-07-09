const request = require('supertest')
const app = require('./../app')

// AUTH
export const EMAIL = 'email@company.com'
export const PASSWORD = 'password'

export async function createUser() {
  const response = await request(app)
    .post('/api/users')
    .send({
      name: 'joe',
      PASSWORD,
      EMAIL,
    })
  return JSON.parse(response.text).token
}

export function createSourceNoAuthor(token, resource) {
  return request(app)
    .post('/api/sources')
    .set('x-auth-token', token)
    .send({
      resource,
    })
}
