const db = require('../db')
const List = require('./list');

const {
    NotFoundError,
    BadRequestError,
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

/** addList*/
describe('addList', function () {
    const newList = {
        username: 'u1',
        title: 'new reading list',
        description: 'the new list'
    }
    test('correctly adds a list', async function () {
        const list = await List.addList(newList);
        expect(list).toEqual({
            ...newList,
            id: expect.any(Number)
        });
    });
});

/** getAll */
describe('getAll', function () {
    test('works', async function () {
        const lists = await List.getAll();
        expect(lists).toEqual([
            {
                id: readinglistIDs[0],
                username: 'u1',
                title: 'fakereadinglist',
                description: 'this is a fake reading list'
            }
        ]);
    });
});

/** getByUser */
describe('getByUser', function () {
    test('works', async function () {
        const lists = await List.getByUser('u1');
        expect(lists).toEqual([
            {
                id: readinglistIDs[0],
                title: 'fakereadinglist',
            }
        ]);
    });
    test('empty on no lists', async function () {
        const lists = await List.getByUser('u2');
        expect(lists).toEqual([]);
    });
});

/** get */
describe('get', function () {
    test('works', async function () {
        const list = await List.get(readinglistIDs[0]);
        expect(list).toEqual({
            id: readinglistIDs[0],
            username: 'u1',
            title: 'fakereadinglist',
            description: 'this is a fake reading list',
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
        });
    });
    test('not found on no such list', async function () {
        try {
            await List.get(-1);
            fail();
        } catch (e) {
            expect(e instanceof NotFoundError).toBeTruthy();
        }
    });
})

/** addBook */
describe('addBook', function () {
    test('works', async function () {
        await List.addBook(readinglistIDs[0], 'fakebook2');
        const list = await List.get(readinglistIDs[0]);
        expect(list).toEqual({
            id: readinglistIDs[0],
            username: 'u1',
            title: 'fakereadinglist',
            description: 'this is a fake reading list',
            books: [
                {
                    id: 'fakebook1',
                    title: 'fakebook1',
                    authors: 'fakeauthor',
                    description: 'fakedescription',
                    cover: 'fakelink.com/cover1',
                    link: 'fakelink.com/book1'
                },
                {
                    id: 'fakebook2',
                    title: 'fakebook2',
                    authors: 'fakeauthor',
                    description: 'fakedescription',
                    cover: 'fakelink.com/cover2',
                    link: 'fakelink.com/book2'
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
        });
    });
    test('Not Found on bad list id', async function () {
        try {
            await List.addBook(-1, 'fakebook1');
            fail();
        } catch (e) {
            expect(e instanceof NotFoundError).toBeTruthy();
        }
    });
    test('Bad Request on duplicate add', async function () {
        try {
            await List.addBook(readinglistIDs[0], 'fakebook1');
            fail();
        } catch (e) {
            expect(e instanceof BadRequestError).toBeTruthy();
        }
    })
})

/** removeBook */
describe('removeBook', function () {
    test('works', async function () {
        await List.removeBook(readinglistIDs[0], 'fakebook1');
        const list = await List.get(readinglistIDs[0]);
        expect(list).toEqual({
            id: readinglistIDs[0],
            username: 'u1',
            title: 'fakereadinglist',
            description: 'this is a fake reading list',
            books: [],
            reviews: [
                {
                    username: 'u2',
                    rating: 10,
                    title: 'stellar review',
                    body: 'what a great list'
                }
            ]
        });
    });
    test('bad request on book not on list', async function () {
        try {
            await List.removeBook(readinglistIDs[0], 'fakebook2');
            fail();
        } catch (e) {
            expect(e instanceof BadRequestError).toBeTruthy();
        }
    });
})

/** remove */
describe('remove', function () {
    test('works', async function () {
        await List.remove(readinglistIDs[0]);
        const lists = await List.getAll();
        expect(lists).toEqual([]);
    });
    test('Not Found on bad list id', async function () {
        try {
            await List.remove(-1);
            fail();
        } catch (e) {
            expect(e instanceof NotFoundError).toBeTruthy();
        }
    })
});

/** updateList */
describe('updateList', function () {
    test('works', async function () {
        const title = 'newTitle';
        const description = 'newDesc';
        const list = await List.updateList(readinglistIDs[0], title, description);
        expect(list).toEqual({
            id: readinglistIDs[0],
            title,
            description
        });
    });
    test('Not Found on bad list id', async function () {
        try {
            await List.updateList(-1, 'badtitle', 'baddesc');
            fail();
        } catch (e) {
            expect(e instanceof NotFoundError).toBeTruthy();
        }
    });
    test('bad request on no title', async function () {
        try {
            await List.updateList(readinglistIDs[0]);
            fail();
        } catch (e) {
            expect(e instanceof BadRequestError).toBeTruthy();
        }
    })
})