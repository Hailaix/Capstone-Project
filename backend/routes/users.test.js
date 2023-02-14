const request = require('supertest');
const app = require('../app');

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    readinglistIDs,
    u1Token,
    u2Token
} = require('./_testcommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/** POST /users/register */
describe("POST /users/register", function () {
    test('registers a new user', async function () {
        const res = await request(app)
            .post('/users/register')
            .send({
                username: 'newUser',
                password: 'password',
                email: 'new@email.com'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual({
            token: expect.any(String)
        });
    });

    test('bad request if missing fields', async function () {
        const res = await request(app)
            .post('/users/register')
            .send({
                username: 'newUser'
            });
        expect(res.statusCode).toEqual(400);
    });

    test('bad request on dupe username', async function () {
        await request(app)
            .post('/users/register')
            .send({
                username: 'newUser',
                password: 'password',
                email: 'new@email.com'
            });
        const res = await request(app)
            .post('/users/register')
            .send({
                username: 'newUser',
                password: 'password',
                email: 'new@email.com'
            });
        expect(res.statusCode).toEqual(400);
    });

});

/** POST /users/login */
describe('POST /users/login', function () {
    test('works', async function () {
        const res = await request(app)
            .post('/users/login')
            .send({
                username: 'u1',
                password: 'password'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            token: expect.any(String)
        });
    });

    test('unauthorized if incorrect password', async function () {
        const res = await request(app)
            .post('/users/login')
            .send({
                username: 'u1',
                password: 'incorrect'
            });
        expect(res.statusCode).toEqual(401);
    });

    test('unauthorized if user does not exist', async function () {
        const res = await request(app)
            .post('/users/login')
            .send({
                username: 'fakeUser',
                password: 'incorrect'
            });
        expect(res.statusCode).toEqual(401);
    });

    test('bad request if missing fields', async function () {
        const res = await request(app)
            .post('/users/login')
            .send({});
        expect(res.statusCode).toEqual(400);
    });

    test('bad request if invalid fields', async function () {
        const res = await request(app)
            .post('/users/login')
            .send({
                username: 2,
                password: 'bad'
            });
        expect(res.statusCode).toEqual(400);
    })

});

/** GET /users/:username */
describe('GET /users/:username', function () {
    test('works', async function () {
        const res = await request(app)
            .get('/users/u1')
            .set('authorization', u1Token);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            user: {
                username: 'u1',
                email: 'u1@email.com',
                bio: 'u1 bio',
                lists: [
                    {
                        id: readinglistIDs[0],
                        title: 'testList'
                    }
                ]
            }
        });
    });

    test('unauthorized if not logged in', async function () {
        const res = await request(app).get('/users/u1');
        expect(res.statusCode).toEqual(401);
    });

    test('not found if user does not exist', async function () {
        const res = await request(app)
            .get('/users/fakeUser')
            .set('authorization', u1Token);
        expect(res.statusCode).toEqual(404);
    });

});

/** DELETE /users/:username */
describe('DELETE /users/:username', function () {
    test('works for user', async function () {
        const res = await request(app)
            .delete('/users/u1')
            .set('authorization', u1Token);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ deleted: 'u1' });
    });

    test('unauthorized if not logged in', async function () {
        const res = await request(app).delete('/users/u1');
        expect(res.statusCode).toEqual(401);
    });

    test('unauthorized if incorrect user', async function () {
        const res = await request(app)
            .delete('/users/u1')
            .set('authorization', u2Token);
        expect(res.statusCode).toEqual(401);
    });

});

/** PATCH /users/:username */
describe('PATCH /users/:username', function () {
    test('works', async function () {
        const res = await request(app)
            .patch('/users/u1')
            .send({
                email: 'new@email.com'
            })
            .set('authorization', u1Token);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            user: {
                username: 'u1',
                email: 'new@email.com',
                bio: 'u1 bio',
            }
        });
    });

    test('unauthorized if not logged in', async function () {
        const res = await request(app)
            .patch('/users/u1')
            .send({
                email: 'new@email.com'
            });
        expect(res.statusCode).toEqual(401);
    });

    test('unauthorized if incorrect user', async function () {
        const res = await request(app)
            .patch('/users/u1')
            .send({
                email: 'new@email.com'
            })
            .set('authorization', u2Token);
        expect(res.statusCode).toEqual(401);
    });

    test('bad request if invalid fields', async function () {
        const res = await request(app)
            .patch('/users/u1')
            .send({
                email: 'bad',
                bio: 2
            })
            .set('authorization', u1Token);
        expect(res.statusCode).toEqual(400);
    });

});