const request = require('supertest');
const { app } = require('../server');
const mongoose = require('mongoose');

// Optional: Disconnect mongoose after tests if it tries to stay connected
afterAll(async () => {
  await mongoose.connection.close();
});

describe('API Health Check', () => {
  it('should return API is running on the root route', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe('CID Cell API is running (with Socket.io active!)');
  });

  it('should return a 404 for unknown routes', async () => {
    const res = await request(app).get('/api/this-route-does-not-exist');
    // It should hit your error handler or return standard 404
    expect(res.statusCode).toBe(404);
  });
});