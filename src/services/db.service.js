const mysql = require('mysql2/promise');
const dbConfig = require('../configs/db.config');
const Success = require('./domain/success.domain');
const Error = require('./domain/errors.domain');

class QuerySuccess extends Success {
    constructor(result) {
        super();
        this.code = 200;
        this.message = 'Query successful';
        this.result = result;
    }
}

let connection;

async function getConnection() {
    try {
        if (!connection) {
            // if connection is not provided, create a new one
            connection = await mysql.createConnection(dbConfig);
        }
        return connection;
    } catch (err) {
        console.error(err);
        return new Error.DatabaseError(err);
    }
}

async function setConnection(newConnection) {
    try {
        connection = newConnection;
    } catch (err) {
        return new Error.DatabaseError(err);
    }
}

async function closeConnection() {
    try {
        await connection.end();
    } catch (err) {
        return new Error.DatabaseError(err);
    }
}

async function query(sql, params) {
    try {
        connection = await getConnection();
        const [rows] = await connection.execute(sql, params);
        return new QuerySuccess(rows);
    } catch (err) {
        console.log(err);
        return new Error.DatabaseError(err);
    }
}

module.exports = {
    query,
    QuerySuccess,
    getConnection,
    closeConnection,
    setConnection,
};
