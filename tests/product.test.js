const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const newProduct = require('../mock-data/new-product.json');
// const { MongoMemoryServer } = require('mongodb-memory-server');
//
// let mongoServer;
//
// beforeAll(async () => {
//     jest.setTimeout(10000); // increase timeout to 10 seconds
//     mongoServer = await MongoMemoryServer.create();
//     const uri = mongoServer.getUri();
//     await mongoose.createConnection(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// });
//
// afterAll(async () => {
//     await mongoose.disconnect();
//     await mongoServer.stop();
// });
//
// describe('Product API', () => {
//     let sampleProduct;
//
//     beforeEach(() => {
//         // Define a sample product object
//         sampleProduct = {
//             "name": "Product 100",
//             "price": 60,
//             "description": "This is a sample product",
//             "views" : 0
//         };
//     });
//
//     afterEach(async () => {
//         // Clean up the database after each test
//         await mongoose.connection.dropDatabase();
//     });
//
//
// it('should create a new product', async () => {
//         // Send a POST request to the API endpoint
//         const response = await request(app)
//             .post('/api/products')
//             .send(sampleProduct);
//
//         // Check that the response status is 201
//         expect(response.status).toBe(201);
//     });
//
// });


// describe('Product endpoints', () => {
//     let productId;
//
//     // Test POST endpoint
//     describe('POST /api/products', () => {
//         it('should create a new product', async () => {
//             const res = await request(app)
//                 .post('/api/products')
//                 .send({
//                     name: 'Test Product',
//                     description: 'This is a test product',
//                     price: 9.99,
//                     currency: 'USD',
//                     quantity: 10,
//                 });
//             expect(res.statusCode).toEqual(201);
//             expect(res.body).toHaveProperty('name', 'Test Product');
//             expect(res.body).toHaveProperty('description', 'This is a test product');
//             expect(res.body).toHaveProperty('price', 9.99);
//             expect(res.body).toHaveProperty('currency', 'USD');
//             expect(res.body).toHaveProperty('quantity', 10);
//             productId = res.body._id;
//         });
//     });
//
//     // Test GET by ID endpoint
//     describe('GET /api/products/:id', () => {
//         it('should retrieve the product with the given ID', async () => {
//             const res = await request(app)
//                 .get(`/api/products/${productId}?currency=CAD`);
//             expect(res.statusCode).toEqual(200);
//             expect(res.body).toHaveProperty('_id', productId);
//             expect(res.body).toHaveProperty('name', 'Test Product');
//             expect(res.body).toHaveProperty('description', 'This is a test product');
//             expect(res.body).toHaveProperty('price', expect.any(Number));
//             expect(res.body).toHaveProperty('currency', 'CAD');
//             expect(res.body).toHaveProperty('quantity', 10);
//         });
//     });
//
//     // Test GET most viewed endpoint
//     describe('GET /api/products/most-viewed', () => {
//         it('should retrieve the most viewed products', async () => {
//             const res = await request(app)
//                 .get('/api/products/most-viewed?limit=5');
//             expect(res.statusCode).toEqual(200);
//             expect(res.body).toBeInstanceOf(Array);
//             expect(res.body.length).toBeGreaterThan(0);
//             expect(res.body[0]).toHaveProperty('_id', expect.any(String));
//             expect(res.body[0]).toHaveProperty('name', expect.any(String));
//             expect(res.body[0]).toHaveProperty('description', expect.any(String));
//             expect(res.body[0]).toHaveProperty('price', expect.any(Number));
//             expect(res.body[0]).toHaveProperty('currency', expect.any(String));
//             expect(res.body[0]).toHaveProperty('quantity', expect.any(Number));
//         });
//     });
//
//     // Test GET by ID endpoint with invalid ID
//     describe('GET /api/products/:id', () => {
//         it('should return 404 for invalid product ID', async () => {
//             const res = await request(app)
//                 .get('/api/products/63ff2aa301335bc417027d69');
//             expect(res.statusCode).toEqual(404);
//         });
//     });
//
//     // Test DELETE endpoint
//     describe('DELETE /api/products/:id', () => {
//         it('should delete the product with the given ID', async () => {
//             const res = await request(app)
//                 .delete(`/api/products/${productId}`);
//             expect(res.statusCode).toEqual(204);
//         });
//     });
// });

describe('Test POST /api/products', () => {
    it('should return 201 status code', async () => {
        const response = await request(app)
            .post('/api/products')
            .send(newProduct);
        expect(response.statusCode).toBe(201);
    });

    it('should return JSON body in the response', async () => {
        const response = await request(app)
            .post('/api/products')
            .send(newProduct);
        expect(response.headers['content-type']).toMatch(/json/);
    });

    it('should return the newly created product', async () => {
        const response = await request(app)
            .post('/api/products')
            .send(newProduct);
        expect(response.body.name).toBe(newProduct.name);
        expect(response.body.description).toBe(newProduct.description);
    });
});