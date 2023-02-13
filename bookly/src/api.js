import axios from 'axios';

const BASE_URL = process.env.REACT_BASE_URL || 'http://localhost:5000';

/** Singular class that contains every method that sends and recieves data from the express API */

class BooklyAPI {
    //JWT needed to authorize requests to the API
    static token;

    /** sends a formatted request to the API at a specified endpoint
     */
    static async request(endpoint, data = {}, method = 'get') {
        const url = `${BASE_URL}/${endpoint}`;
        //sets the authorization header to contain the token, allowing requests to properly go through
        const headers = { Authorization: BooklyAPI.token };
        //if the request is a get request, sets data to be query parameters (data will still be sent in the body, but causes no issues)
        const params = (method === 'get')
            ? data
            : {};
        try {
            //sends the formatted request to the API
            const res = await axios({ url, method, data, params, headers });
            return res.data;
        } catch (e) {
            const message = e.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    /** API Routes */

    /**User Routes */

    /**POST login using data : {username, password}, recieves a token on successful login*/
    static async login(data) {
        const res = await this.request('users/login', data, 'post');
        return res.token;
    }

    /**POST register a new user with data : {username, password, email}, recieves a token on successful creation */
    static async register(data) {
        const res = await this.request('users/register', data, 'post');
        return res.token;
    }

    /**GET a user's profile information */
    static async getUser(username) {
        const res = await this.request(`users/${username}`);
        return res.user;
    }

    /**PATCH update a user with new data : {email, password, bio} */
    static async editUser(username, data) {
        const res = await this.request(`users/${username}`, data, 'patch');
        return res.user;
    }

    /**DELETE removes a user from the db */
    static async removeUser(username) {
        await this.request(`users/${username}`, {}, 'delete');
    }

    /**List Routes */

    /**GET a list of every reading list in the db */
    static async getLists() {
        const res = await this.request('lists');
        return res.lists;
    }

    /**GET all lists created by username */
    static async getUserLists(username) {
        const res = await this.request(`lists/user/${username}`);
        return res.lists;
    }

    /**GET a specifed list */
    static async getList(list_id) {
        const res = await this.request(`lists/${list_id}`);
        return res.list;
    }

    /**POST create a new list with data : {title, description} */
    static async createList(data) {
        const res = await this.request('lists', data, 'post');
        return res.list;
    }

    /**PUT update a list with new data : {title, description} */
    static async editList(list_id, data) {
        const res = await this.request(`lists/${list_id}`, data, 'put');
        return res.list;
    }

    /**DELETE removes a list from the db */
    static async removeList(list_id) {
        await this.request(`lists/${list_id}`, {}, 'delete');
    }

    /**POST add a book to a list */
    static async addBook(list_id, book_id) {
        await this.request(`lists/${list_id}/books/${book_id}`, {}, 'post');
    }

    /**DELETE remove a book from a list */
    static async removeBook(list_id, book_id) {
        await this.request(`lists/${list_id}/books/${book_id}`, {}, 'delete');
    }
    /**Search Route */

    /**GET searches the google books API for matches to search terms in data
     *  data : { q, intitle, inauthor, isbn, offset}
     * returns a list of books
     */
    static async search(data) {
        const res = await this.request(`search`, data);
        return res.books;
    }

    /**Review Routes */

    /**POST creates a new review of a list by user 
     * data: {rating, title, body}, title and body optional
     * returns the review
    */
    static async createReview(list_id, data) {
        //ensure that rating is an integer
        data.rating = +data.rating;
        const res = await this.request(`reviews/${list_id}`, data, 'post');
        return res.review;
    }

    /**PATCH edits a review with new data
     * data: {rating, title, body}
     * returns the edited review
     */
    static async editReview(list_id, username, data) {
        //ensure that rating is an integer
        if (data.rating) data.rating = +data.rating
        const res = await this.request(`reviews/${list_id}/${username}`, data, 'patch');
        return res.review;
    }

    /**DELETE removes the user's review from the list */
    static async removeReview(list_id, username) {
        await this.request(`reviews/${list_id}/${username}`, {}, 'delete');
    }
}

export default BooklyAPI;