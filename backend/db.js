/** Database connection for bookly. */

const { Client } = require("pg");

const client = new Client(process.env.DATABASE_URL || "postgresql:///bookly");

client.connect();


module.exports = client;
