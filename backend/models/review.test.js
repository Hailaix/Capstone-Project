const db = require('../db');
const Review = require('./review');

const {
    NotFoundError,
    BadRequestError
} = require('../expressError');

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    readinglistIDs
} = require('./_testcommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/** getAll */
describe('getAll', function () {
    test('works', async function () {
        const reviews = await Review.getAll(readinglistIDs[0]);
        expect(reviews).toEqual([
            {
                username: 'u2',
                rating: 10,
                title: 'stellar review',
                body: 'what a great list'
            }
        ]);
    });
});

/** AddReview */
describe('addReview', function () {
    const review = {
        rating: 0,
        title: 'bad list',
        body: 'this list is bad'
    };
    test('works', async function () {
        const res = await Review.addReview(readinglistIDs[0], 'u3', review);
        expect(res).toEqual({
            list_id: readinglistIDs[0],
            username: 'u3',
            ...review
        });
    });

    test('not found if no such list', async function () {
        try {
            await Review.addReview(-1, 'u3', review);
            fail();
        } catch (e) {
            expect(e instanceof NotFoundError).toBeTruthy();
        }
    });

    test('not found if no such user', async function () {
        try {
            await Review.addReview(readinglistIDs[0], 'fakeUser', review);
            fail();
        } catch (e) {
            expect(e instanceof NotFoundError).toBeTruthy();
        }
    });

    test('bad request if user has already reviewed', async function () {
        try {
            await Review.addReview(readinglistIDs[0], 'u3', review);
            await Review.addReview(readinglistIDs[0], 'u3', review);
            fail();
        } catch (e) {
            expect(e instanceof BadRequestError).toBeTruthy();
        }
    });

    test('bad request if rating is not present', async function () {
        try {
            await Review.addReview(readinglistIDs[0], 'u3', {});
            fail();
        } catch (e) {
            expect(e instanceof BadRequestError).toBeTruthy();
        }
    });
});

/** Remove */
describe('remove', function () {
    test('works', async function () {
        await Review.remove(readinglistIDs[0], 'u2');
        const res = await db.query(`
        SELECT * FROM reviews
        WHERE username = $1`, ['u2']);
        expect(res.rows.length).toEqual(0);
    });

    test('not found if no such review', async function () {
        try {
            await Review.remove(readinglistIDs[0], 'fakeUser');
            fail();
        } catch (e) {
            expect(e instanceof NotFoundError).toBeTruthy();
        }
    });
});

/** Edit */
describe('edit', function () {
    const editData = {
        rating: 5,
        title: 'edited review',
        body: 'I guess this is just fine'
    }
    test('works', async function () {
        const edited = await Review.edit(readinglistIDs[0], 'u2', editData);
        expect(edited).toEqual({
            ...editData,
            list_id: readinglistIDs[0],
            username: 'u2'
        });
    });

    test('works on partial edit', async function () {
        const edited = await Review.edit(readinglistIDs[0], 'u2', { rating: 9 });
        expect(edited).toEqual({
            list_id: readinglistIDs[0],
            username: 'u2',
            rating: 9,
            title: 'stellar review',
            body: 'what a great list'
        });
    });

    test('not found if no such review', async function () {
        try {
            await Review.edit(readinglistIDs[0], 'fakeUser', editData);
            fail();
        } catch (e) {
            expect(e instanceof NotFoundError).toBeTruthy();
        }
    });

    test('bad request if no edit data', async function () {
        try {
            await Review.edit(readinglistIDs[0], 'u2', {});
            fail();
        } catch (e) {
            expect(e instanceof BadRequestError).toBeTruthy();
        }
    });
});