const validateGroupDoesntExistQuery = 'SELECT * FROM Groups WHERE name = ?';

function validateGroupDoesntExist(queryResult) {
    if (queryResult.result.length > 0) {
        return new Error.GroupExistsError();
    }

    return queryResult;
}

module.exports = { validateGroupDoesntExistQuery, validateGroupDoesntExist };
