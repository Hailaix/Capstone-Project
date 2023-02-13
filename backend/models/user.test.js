const db = require('../db');
const User = require('./user');

const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError
} = require('../expressError');

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
} = require('./_testcommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/** Authenticate */
describe('authenticate', function () {
    test('works', async function () {
        const user = await User.authenticate('u1', 'password');
        expect(user).toEqual({
            username: 'u1'
        });
    });

    test('unauthorized on no such user', async function () {
        try {
            await User.authenticate('fake', 'password');
            fail();
        } catch (e) {
            expect(e instanceof UnauthorizedError).toBeTruthy();
        }
    });

    test('unauthorized on wrong password', async function () {
        try {
            await User.authenticate('u1', 'garbage');
            fail();
        } catch (e) {
            expect(e instanceof UnauthorizedError).toBeTruthy();
        }
    });
});

/** Register */
describe('Register', function () {
    test('works', async function () {
        const newUser = {
            username: 'newuser',
            email: 'new@email.com',
            bio: "new user's bio"
        }
        const user = await User.register({ ...newUser, password: 'password' });
        expect(user).toEqual(newUser);
        const res = await db.query(`
        SELECT username, email, bio
        FROM users
        WHERE username=$1`, ['newuser']);
        expect(res.rows.length).toEqual(1);
        expect(res.rows[0]).toEqual(newUser);
    });

    test('bad request on dupe', async function () {
        try {
            await User.register({
                username: 'u1',
                email: 'u1@email.com',
                bio: 'u1 bio',
                password: 'password'
            });
            fail();
        } catch (e) {
            expect(e instanceof BadRequestError).toBeTruthy();
        }
    })
});

/** Get */
describe('Get', function () {
    test('works', async function () {
        const user = await User.get('u2');
        expect(user).toEqual({
            username: 'u2',
            email: 'u2@email.com',
            bio: 'u2 bio',
            lists: []
        });
    });

    test('not found if no such user', async function () {
        try {
            await User.get("fakeUser");
            fail();
        } catch (e) {
            expect(e instanceof NotFoundError).toBeTruthy();
        }
    });
});

/** Remove */
describe('Remove', function () {
    test('works', async function () {
        await User.remove('u1');
        const res = await db.query(
            'SELECT * FROM users WHERE username=$1',
            ['u1']
        );
        expect(res.rows.length).toEqual(0);
    });
    test('not found if no such user', async function () {
        try {
            await User.remove('fakeUser');
            fail();
        } catch (e) {
            expect(e instanceof NotFoundError).toBeTruthy();
        }
    });
});

/** Update */
describe('Update', function () {
    const u2update = {
        email: 'newu2@email.com',
        bio: 'u2 new bio'
    };

    test('works', async function () {
        const updateduser = await User.update('u2', { ...u2update, password: 'newpassword' });
        expect(updateduser).toEqual({
            ...u2update,
            username: 'u2'
        });
    });

    test('partial update works', async function () {
        const partiallyupdated = await User.update('u2', { bio: 'u2 new bio' });
        expect(partiallyupdated).toEqual({
            username: 'u2',
            bio: 'u2 new bio',
            email: 'u2@email.com'
        });
    });

    test('not found if no such user', async function () {
        try {
            await User.update('fakeUser', { bio: 'fake bio' });
            fail();
        } catch (e) {
            expect(e instanceof NotFoundError).toBeTruthy();
        }
    });

    test('bad request if no data', async function () {
        try {
            await User.update('u1', {});
            fail();
        } catch (e) {
            expect(e instanceof BadRequestError).toBeTruthy();
        }
    });
});