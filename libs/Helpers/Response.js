
Response = function() {
};

/**
 * @public
 * @param {!Response} res
 * @param {!String} error
 */
Response.prototype.sendError = function(res, error) {
    res.status(400).json(this.error(result));
};

/**
 * @public
 * @param {!Response} res
 * @param {*} result
 */
Response.prototype.send = function(res, result) {
    res.status(200).json(this.message(result));
};

/**
 * @private
 */
Response.prototype.error = function(message) {
    return {'error': message};
};

/**
 * @private
 */
Response.prototype.message = function(message) {
    return {'data': message};
};

module.exports = Response;