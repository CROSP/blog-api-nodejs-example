/**
 * Created by crosp on 5/12/17.
 */
const passport = require('passport-strategy')
    , jwt = require('jsonwebtoken');

const BaseAuthStrategy = require(APP_AUTH_STRATEGY + 'base-auth');

class JwtRsStrategy extends BaseAuthStrategy {
    constructor(options, verify) {
        super();
        this._options = options;
        this._customVerifier = verify;
        this._initStrategy();
    }

    _initStrategy() {
        passport.Strategy.call(this);
        let options = this.provideOptions();

        if (!options) {
            throw new TypeError('JwtRsStrategy requires options');
        }
        this._privateKey = options.privateKey;
        if (!this._privateKey) {
            throw new TypeError('JwtRsStrategy requires a private key');
        }
        this._publicKey = options.publicKey;
        if (!this._publicKey) {
            throw new TypeError('JwtRsStrategy requires a public key');
        }

        this._extractJwtToken = options.extractJwtToken;
        if (!this._extractJwtToken) {
            throw new TypeError('JwtRsStrategy requires a function to parse jwt from requests');
        }
        this._verifyOpts = {};

        if (options.issuer) {
            this._verifyOpts.issuer = options.issuer;
        }

        if (options.audience) {
            this._verifyOpts.audience = options.audience;
        }

        if (options.algorithms) {
            this._verifyOpts.algorithms = options.algorithms;
        }

        if (options.ignoreExpiration != null) {
            this._verifyOpts.ignoreExpiration = options.ignoreExpiration;
        }
    }

    get name() {
        return 'jwt-rs-auth';
    }

    provideSecretKey() {
        return this._privateKey;
    }

    authenticate(req, callback) {
        let self = this;

        let token = self._extractJwtToken(req);

        if (!token) {
            return callback.onFailure(new Error("No auth token provided"));
        }
        // Verify the JWT
        JwtRsStrategy._verifyDefault(token, this._publicKey, this._verifyOpts, function (jwt_err, payload) {
            if (jwt_err) {
                return callback.onFailure(jwt_err);
            } else {
                try {
                    // If custom verifier was set delegate the flow control
                    if (self._customVerifier) {
                        self._customVerifier(token, payload, callback);
                    }
                    else {
                        callback.onVerified(token, payload);
                    }
                } catch (ex) {
                    callback.onFailure(ex);
                }
            }
        });
    }


    provideOptions() {
        return this._options;
    }

    static _verifyDefault(token, publicKey, options, callback) {
        return jwt.verify(token, publicKey, options, callback);
    }
}

module.exports = JwtRsStrategy;
