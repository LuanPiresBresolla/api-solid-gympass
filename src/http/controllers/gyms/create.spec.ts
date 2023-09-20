import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'

describe('Create Gym Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript',
        description: 'JavaScript Gym',
        phone: '888888',
        latitude: -27.8143599,
        longitude: -50.3172257,
      })

    expect(response.statusCode).toEqual(201)
  })
})
