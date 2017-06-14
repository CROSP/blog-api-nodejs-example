/** few custom error types required for web apps **/

require('./index.js');


/**
 * thrown when there is an app related error 
 */
exports.AppError = Error.extend('AppError', 500);


/**
 * thrown when there is error in client request/data
 */
var ClientError = exports.ClientError = Error.extend('ClientError', 400);


/**
 * specific http error types
 */
exports.HttpNotFound = ClientError.extend('HttpNotFound', 404);
exports.HttpUnauthorized = ClientError.extend('HttpUnauthorized', 401);
exports.HttpForbidden = ClientError.extend('HttpForbidden', 403);
exports.HttpConflict = ClientError.extend('HttpConflict', 409); //unique constraint error


