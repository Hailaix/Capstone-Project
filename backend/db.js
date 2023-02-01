/** Database connection for bookly. */

const { Client } = require("pg");
const { getDatabaseUri } = require('./config');

const client = new Client(process.env.DATABASE_URL || `postgresql:///${getDatabaseUri()}`);

client.connect();


module.exports = client;
