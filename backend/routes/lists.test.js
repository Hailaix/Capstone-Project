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

/** GET /lists */
describe('GET /lists', function () {
    test('works', async function () {
        const res = await request(app).get('/lists');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            lists: [
                {
                    id: readinglistIDs[0],
                    username: 'u1',
                    title: 'testList',
                    description: 'new test list'
                }
            ]
        });
    });
});

/** GET /lists/:id */
describe('GET /lists/:id', function () {
    test('works', async function () {
        const res = await request(app)
            .get(`/lists/${readinglistIDs[0]}`)
            .set('authorization', u2Token);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            list: {
                id: readinglistIDs[0],
                username: 'u1',
                title: 'testList',
                description: 'new test list',
                books: [
                    {
                        id: 'fakebook1',
                        title: 'fakebook1',
                        authors: 'fakeauthor',
                        description: 'fakedescription',
                        cover: 'fakelink.com/cover1',
                        link: 'fakelink.com/book1'
                    }
                ],
                reviews: [
                    {
                        username: 'u2',
                        rating: 10,
                        title: 'stellar review',
                        body: 'what a great list'
                    }
                ]
            }
        });
    });

    test('unauthorized if not logged in', async function () {
        const res = await request(app)
            .get(`/lists/${readinglistIDs[0]}`);
        expect(res.statusCode).toEqual(401);
    });

    test('not found if list does not exist', async function () {
        const res = await request(app)
            .get(`/lists/-1`)
            .set('authorization', u2Token);
        expect(res.statusCode).toEqual(404);
    });

});

/** GET /lists/user/:username */
describe('GET /lists/user/:username', function () {
    test('works', async function () {
        const res = await request(app)
            .get('/lists/user/u1')
            .set('authorization', u2Token);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            lists: [
                {
                    id: readinglistIDs[0],
                    title: 'testList'
                }
            ]
        });
    });

    test('unauthorized if not logged in', async function () {
        const res = await request(app)
            .get('/lists/user/u1');
        expect(res.statusCode).toEqual(401);
    });

    test('empty if no lists', async function () {
        const res = await request(app)
            .get('/lists/user/u2')
            .set('authorization', u2Token);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ lists: [] });
    });
});

/** POST /lists */
describe('POST /lists', function () {
    test('works', async function () {
        const res = await request(app)
            .post('/lists')
            .send({
                title: 'testList',
                description: 'the new list'
            })
            .set('authorization', u2Token);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual({
            list: {
                id: expect.any(Number),
                title: 'testList',
                description: 'the new list',
                username: 'u2'
            }
        });
    });

    test('unauthorized if not logged in', async function () {
        const res = await request(app)
            .post('/lists')
            .send({
                title: 'testList',
                description: 'the new list'
            });
        expect(res.statusCode).toEqual(401);
    });

    test('bad request on missing fields', async function () {
        const res = await request(app)
            .post('/lists')
            .set('authorization', u2Token);
        expect(res.statusCode).toEqual(400);
    });

    test('bad request on invalid fields', async function () {
        const res = await request(app)
            .post('/lists')
            .send({
                title: 11,
                description: 'bad title'
            })
            .set('authorization', u2Token);
        expect(res.statusCode).toEqual(400);
    });

});

/** DELETE /lists/:id */
describe('DELETE /lists/:id', function () {
    test('works', async function () {
        const res = await request(app)
            .delete(`/lists/${readinglistIDs[0]}`)
            .set('authorization', u1Token);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ deleted: readinglistIDs[0] });
    });

    test('unauthorized if not logged in', async function () {
        const res = await request(app)
            .delete(`/lists/${readinglistIDs[0]}`);
        expect(res.statusCode).toEqual(401);
    });

    test('unauthorized if incorrect user', async function () {
        const res = await request(app)
            .delete(`/lists/${readinglistIDs[0]}`)
            .set('authorization', u2Token);
        expect(res.statusCode).toEqual(401);
    });

    test('not found if list does not exist', async function () {
        const res = await request(app)
            .delete(`/lists/-1`)
            .set('authorization', u1Token);
        expect(res.statusCode).toEqual(404);
    });

});

/** PUT /lists/:id */
describe('PUT /lists/:id', function () {
    test('works', async function () {
        const res = await request(app)
            .put(`/lists/${readinglistIDs[0]}`)
            .send({
                title: 'brand new title',
                description: 'brand new description'
            })
            .set('authorization', u1Token);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            list: {
                id: readinglistIDs[0],
                title: 'brand new title',
                description: 'brand new description'
            }
        });
    });

    test('unauthorized if not logged in', async function () {
        const res = await request(app)
            .put(`/lists/${readinglistIDs[0]}`)
            .send({
                title: 'brand new title',
                description: 'brand new description'
            });
        expect(res.statusCode).toEqual(401);
    });

    test('unauthorized if incorrect user', async function () {
        const res = await request(app)
            .put(`/lists/${readinglistIDs[0]}`)
            .send({
                title: 'brand new title',
                description: 'brand new description'
            })
            .set('authorization', u2Token);
        expect(res.statusCode).toEqual(401);
    });

    test('bad request if missing fields', async function () {
        const res = await request(app)
            .put(`/lists/${readinglistIDs[0]}`)
            .send({
                title: 'brand new title',
            })
            .set('authorization', u1Token);
        expect(res.statusCode).toEqual(400);
    });

    test('not found if list does not exist', async function () {
        const res = await request(app)
            .put(`/lists/-1`)
            .send({
                title: 'brand new title',
                description: 'brand new description'
            })
            .set('authorization', u1Token);
        expect(res.statusCode).toEqual(404);
    });
});

/** POST /lists/:id/books/:book_id */
describe('POST /lists/:id/books/:book_id', function () {
    test('works', async function () {
        const res = await request(app)
            .post(`/lists/${readinglistIDs[0]}/books/fakebook2`)
            .set('authorization', u1Token);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual({
            addedBook: {
                book_id: 'fakebook2',
                list_id: readinglistIDs[0]
            }
        });
    });

    test('unauthorized if not logged in', async function () {
        const res = await request(app)
            .post(`/lists/${readinglistIDs[0]}/books/fakebook2`);
        expect(res.statusCode).toEqual(401);
    });

    test('unauthorized if incorrect user', async function () {
        const res = await request(app)
            .post(`/lists/${readinglistIDs[0]}/books/fakebook2`)
            .set('authorization', u2Token);
        expect(res.statusCode).toEqual(401);
    });

    test('bad request if book already in list', async function () {
        const res = await request(app)
            .post(`/lists/${readinglistIDs[0]}/books/fakebook1`)
            .set('authorization', u1Token);
        expect(res.statusCode).toEqual(400);
    });

});

/** DELETE /lists/:id/books/:book_id */
describe('DELETE /lists/:id/books/:book_id', function () {
    test('works', async function () {
        const res = await request(app)
            .delete(`/lists/${readinglistIDs[0]}/books/fakebook1`)
            .set('authorization', u1Token);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            removed: `book fakebook1 from list ${readinglistIDs[0]}`
        });
    });

    test('unauthorized if not logged in', async function () {
        const res = await request(app)
            .delete(`/lists/${readinglistIDs[0]}/books/fakebook1`);
        expect(res.statusCode).toEqual(401);
    });

    test('unauthorized if incorrect user', async function () {
        const res = await request(app)
            .delete(`/lists/${readinglistIDs[0]}/books/fakebook1`)
            .set('authorization', u2Token);
        expect(res.statusCode).toEqual(401);
    });

    test('bad request if book not on list', async function () {
        const res = await request(app)
            .delete(`/lists/${readinglistIDs[0]}/books/fakebook2`)
            .set('authorization', u1Token);
        expect(res.statusCode).toEqual(400);
    });

});