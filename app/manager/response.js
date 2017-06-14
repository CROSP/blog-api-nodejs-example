const HttpStatus = require('http-status-codes');
const BasicResponse = {
    "success": false,
    "message": "",
    "data": {}
};

class ResponseManager {
    constructor() {

    }

    static get HTTP_STATUS() {
        return HttpStatus;
    }

    static  getDefaultResponseHandler(res) {
        return {
            onSuccess: function (data, message, code) {
                ResponseManager.respondWithSuccess(res, code || ResponseManager.HTTP_STATUS.OK, data, message);
            },
            onError: function (error) {
                ResponseManager.respondWithError(res, error.status || 500, error.message || 'Unknown error');
            }
        };
    }

    static  getDefaultResponseHandlerData(res) {
        return {
            onSuccess: function (data, message, code) {
                ResponseManager.respondWithSuccess(res, code || ResponseManager.HTTP_STATUS.OK, data, message);
            },
            onError: function (error) {
                ResponseManager.respondWithErrorData(res, error.status, error.message, error.data);
            }
        };
    }

    static  getDefaultResponseHandlerError(res, successCallback) {
        return {
            onSuccess: function (data, message, code) {
                successCallback(data, message, code);
            },
            onError: function (error) {
                ResponseManager.respondWithError(res, error.status || 500, error.message || 'Unknown error');
            }
        };
    }

    static  getDefaultResponseHandlerSuccess(res, errorCallback) {
        return {
            onSuccess: function (data, message, code) {
                ResponseManager.respondWithSuccess(res, code || ResponseManager.HTTP_STATUS.OK, data, message);
            },
            onError: function (error) {
                errorCallback(error);
            }
        };
    }

    static generateHATEOASLink(link, method, rel) {
        return {
            link: link,
            method: method,
            rel: rel
        }
    }

    static respondWithSuccess(res, code, data, message = "", links = []) {
        let response = Object.assign({}, BasicResponse);
        response.success = true;
        response.message = message;
        response.data = data;
        response.links = links;
        res.status(code).json(response);
    }

    static respondWithErrorData(res, errorCode, message = "", data = "", links = []) {
        let response = Object.assign({}, BasicResponse);
        response.success = false;
        response.message = message;
        response.data = data;
        response.links = links;
        res.status(errorCode).json(response);
    }

    static respondWithError(res, errorCode, message = "", links = []) {
        let response = Object.assign({}, BasicResponse);
        response.success = false;
        response.message = message;
        response.links = links;
        res.status(errorCode).json(response);
    }

}
module.exports = ResponseManager;