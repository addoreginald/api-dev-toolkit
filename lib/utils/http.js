/**
 * This function return an unauthorized payload
 */

module.exports.unauthorized = (msg) => {
    return {
        code: 401,
        msg: msg ? msg : 'Authorization failed for this request'
    }
}

/**
 * This function return a bad request payload
 */

module.exports.badRequest = (data, msg) => {
    return {
        code: 400,
        msg: msg ? msg : 'Bad request',
        data: data
    }
}

/**
 * This function return a server error payload
 * @param {*} error
 */

module.exports.serverError = (error, msg) => {
    return {
        code: 500,
        msg: msg ? msg : 'Server error',
        error: error
    }
}

/**
 * This function return a success payload
 * @param {*} data
 */

module.exports.success = (data, msg) => {
    if (data) {
        if (data.hasOwnProperty("data")) {
            return {
                code: 200,
                msg: msg ? msg : 'Success',
                ... data
            }
        } else {
            return {
                code: 200,
                msg: msg ? msg : 'Success',
                data: data
            }
        }
    } else {
        return {
            code: 200,
            msg: msg ? msg : 'Success',
            data: null
        }
    }
}

/**
 * This function gets the user agent from a request header
 * @param {*} req 
 */

module.exports.getUserAgent = (req) => {
    return req.get('User-Agent') ? req.get('User-Agent') : 'Unable to get user-agent';
}


/**
 * This function gets the request ip from a request
 * @param {*} req 
 */

module.exports.getRequestIP = (req) => {
    return requestIp.getClientIp(req);
}