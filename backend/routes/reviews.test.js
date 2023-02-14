const request = require('supertest');
const app = require('../app');

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    readinglistIDs,
    u1Token,
    u2Token,
    u3Token
} = require('./_testcommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/** GET /reviews/:list_id */
describe('GET /reviews/:list_id', function () {
    test('works', async function () {
        const res = await request(app)
            .get(`/reviews/${readinglistIDs[0]}`)
            .set('authorization', u2Token);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            reviews: [
                {
                    rating: 10,
                    username: 'u2',
                    title: 'stellar review',
                    body: 'what a great list'
                }
            ]
        });
    });

    test('unauthorized if not logged in', async function () {
        const res = await request(app)
            .get(`/reviews/${readinglistIDs[0]}`);
        expect(res.statusCode).toEqual(401);
    });
});

/** POST /reviews/:list_id */
describe('POST /reviews/:list_id', function () {
    test('works', async function () {
        const res = await request(app)
            .post(`/reviews/${readinglistIDs[0]}`)
            .send({ rating: 0, title: 'bad list', body: 'this list is bad' })
            .set('authorization', u3Token);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual({
            review: {
                list_id: readinglistIDs[0],
                username: 'u3',
                rating: 0,
                title: 'bad list',
                body: 'this list is bad'
            }
        });
    });

    test('works with only rating', async function () {
        const res = await request(app)
            .post(`/reviews/${readinglistIDs[0]}`)
            .send({ rating: 0 })
            .set('authorization', u3Token);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual({
            review: {
                list_id: readinglistIDs[0],
                username: 'u3',
                rating: 0,
                title: null,
                body: null
            }
        });
    })

    test('unauthorized if not logged in', async function () {
        const res = await request(app)
            .post(`/reviews/${readinglistIDs[0]}`)
            .send({ rating: 0, title: 'bad list', body: 'this list is bad' });
        expect(res.statusCode).toEqual(401);
    });

    test('bad request if user has already left a review', async function () {
        const res = await request(app)
            .post(`/reviews/${readinglistIDs[0]}`)
            .send({ rating: 0, title: 'bad list', body: 'this list is bad' })
            .set('authorization', u2Token);
        expect(res.statusCode).toEqual(400);
    });

    test('bad request if no rating', async function () {
        const res = await request(app)
            .post(`/reviews/${readinglistIDs[0]}`)
            .send({ title: 'bad list', body: 'this list is bad' })
            .set('authorization', u3Token);
        expect(res.statusCode).toEqual(400);
    });

    test('not found if list does not exist', async function () {
        const res = await request(app)
            .post(`/reviews/-1`)
            .send({ rating: 0, title: 'bad list', body: 'this list is bad' })
            .set('authorization', u3Token);
        expect(res.statusCode).toEqual(404);
    })

});

/** PATCH /reviews/:list_id/:username */
describe('PATCH /reviews/:list_id/:username', function () {
    test('works', async function () {
        const res = await request(app)
            .patch(`/reviews/${readinglistIDs[0]}/u2`)
            .send({ rating: 9, title: 'new title', body: 'new body' })
            .set('authorization', u2Token);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            review: {
                list_id: readinglistIDs[0],
                username: 'u2',
                rating: 9,
                title: 'new title',
                body: 'new body'
            }
        });
    });

    test('works on partial update', async function () {
        const res = await request(app)
            .patch(`/reviews/${readinglistIDs[0]}/u2`)
            .send({ rating: 9 })
            .set('authorization', u2Token);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            review: {
                list_id: readinglistIDs[0],
                username: 'u2',
                rating: 9,
                title: 'stellar review',
                body: 'what a great list'
            }
        });
    });

    test('unauthorized if not logged in', async function () {
        const res = await request(app)
            .patch(`/reviews/${readinglistIDs[0]}/u2`)
            .send({ rating: 9, title: 'new title', body: 'new body' });
        expect(res.statusCode).toEqual(401);
    });

    test('unauthorized if incorrect user', async function () {
        const res = await request(app)
            .patch(`/reviews/${readinglistIDs[0]}/u2`)
            .send({ rating: 9, title: 'new title', body: 'new body' })
            .set('authorization', u3Token);
        expect(res.statusCode).toEqual(401);
    });

    test('bad request if no data', async function () {
        const res = await request(app)
            .patch(`/reviews/${readinglistIDs[0]}/u2`)
            .set('authorization', u2Token);
        expect(res.statusCode).toEqual(400);
    });

    test('not found if user has not left review', async function () {
        const res = await request(app)
            .patch(`/reviews/${readinglistIDs[0]}/u3`)
            .send({ rating: 9, title: 'new title', body: 'new body' })
            .set('authorization', u3Token);
        expect(res.statusCode).toEqual(404);
    });

    test('not found if list does not exist', async function () {
        const res = await request(app)
            .patch(`/reviews/-1/u2`)
            .send({ rating: 9, title: 'new title', body: 'new body' })
            .set('authorization', u2Token);
        expect(res.statusCode).toEqual(404);
    })
});

/** DELETE /reviews/:list_id/:username */
describe('DELETE /reviews/:list_id/:username', function () {
    test('works', async function () {
        const res = await request(app)
            .delete(`/reviews/${readinglistIDs[0]}/u2`)
            .set('authorization', u2Token);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            deleted: `u2's review of list ${readinglistIDs[0]}`
        });
    });

    test('unauthorized if not logged in', async function () {
        const res = await request(app)
            .delete(`/reviews/${readinglistIDs[0]}/u2`);
        expect(res.statusCode).toEqual(401);
    });

    test('unauthorized if incorrect user', async function () {
        const res = await request(app)
            .delete(`/reviews/${readinglistIDs[0]}/u2`)
            .set('authorization', u3Token);
        expect(res.statusCode).toEqual(401);
    });

    test('not found if user has not left review', async function () {
        const res = await request(app)
            .delete(`/reviews/${readinglistIDs[0]}/u3`)
            .set('authorization', u3Token);
        expect(res.statusCode).toEqual(404);
    });

    test('not found if list does not exist', async function () {
        const res = await request(app)
            .delete(`/reviews/-1/u2`)
            .set('authorization', u2Token);
        expect(res.statusCode).toEqual(404);
    });

});