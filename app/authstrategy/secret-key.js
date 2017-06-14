/**
 * Created by crosp on 5/12/17.
 */

const BaseAuthStrategy = require(APP_AUTH_STRATEGY + 'base-auth');
const InvalidPayloadError = require(APP_ERROR_PATH + 'invalid-payload');
const UnauthorizedError = require(APP_ERROR_PATH + 'unauthorized');

class SecretKeyAuthStrategy extends BaseAuthStrategy {
    constructor(options) {
        super();
        this._options = options;
        this._initStrategy();
    }

    static get AUTH_HEADER() {
        return "Authorization";
    }

    _initStrategy() {

    }

    get name() {
        return 'secret-key-auth';
    }

    static _extractKeyFromHeader(req) {
        return req.headers[SecretKeyAuthStrategy.AUTH_HEADER.toLowerCase()];
    }

    _verifyCredentials(key) {
        return key === this.provideSecretKey();
    }

    authenticate(req, callback) {
        let secretKey = SecretKeyAuthStrategy._extractKeyFromHeader(req);
        if (!secretKey) {
            return callback.onFailure(new InvalidPayloadError("No auth key provided"));
        }
        if (this._verifyCredentials(secretKey)) {
            return callback.onVerified();
        } else {
            return callback.onFailure(new UnauthorizedError("Invalid secret key"));
        }
    }

    provideSecretKey() {
        return this._options.secretKey;
    }

    provideOptions() {
        return this._options;
    }
}

module.exports = SecretKeyAuthStrategy;
