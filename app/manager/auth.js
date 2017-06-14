/**
 * Created by crosp on 5/12/17.
 */
const BaseAutoBindedClass = require(APP_BASE_PACKAGE_PATH + 'base-autobind');
const JwtRsStrategy = require(APP_AUTH_STRATEGY + 'jwt-rs');
const SecretKeyAuth = require(APP_AUTH_STRATEGY + 'secret-key');
const CredentialsAuth = require(APP_AUTH_STRATEGY + 'credentials');
const ExtractJwt = require("passport-jwt").ExtractJwt;
const JwtToken = require(APP_MODEL_PATH + 'auth/jwt-token');
const RevokedToken = require(APP_MODEL_PATH + 'auth/revoked-token').RevokedTokenModel;
const ForbiddenError = require(APP_ERROR_PATH + 'forbidden');

class AuthManager extends BaseAutoBindedClass {
    constructor() {
        super();
        this._passport = require('passport');
        this._strategies = [];
        this._jwtTokenHandler = require('jsonwebtoken');
        this._setupStrategies();
        this._setPassportStrategies();
    }

    _setupStrategies() {
        // Init JWT strategy
        let jwtOptions = this._provideJwtOptions();
        let secretKeyAuth = new SecretKeyAuth({secretKey: this._provideSecretKey()});
        let jwtRs = new JwtRsStrategy(jwtOptions, this._verifyRevokedToken);
        this._strategies.push(jwtRs);
        this._strategies.push(new CredentialsAuth());
        this._strategies.push(secretKeyAuth);
    }

    _verifyRevokedToken(token, payload, callback) {
        RevokedToken.find({token: token}, function (err, docs) {
            if (docs.length) {
                callback.onFailure(new ForbiddenError("Token has been revoked"));
            } else {
                callback.onVerified(token, payload);
            }
        });
    }

    extractJwtToken(req) {
        return ExtractJwt.fromAuthHeader()(req);
    }

    _provideJwtOptions() {
        let config = global.config;
        let jwtOptions = {};
        jwtOptions.extractJwtToken = ExtractJwt.fromAuthHeader();
        jwtOptions.privateKey = this._provideJwtPrivateKey();
        jwtOptions.publicKey = this._provideJwtPublicKey();
        jwtOptions.issuer = config.jwtOptions.issuer;
        jwtOptions.audience = config.jwtOptions.audience;
        return jwtOptions;
    }

    _provideJwtPublicKey() {
        const fs = require('fs');
        return fs.readFileSync(CONFIG_BASE_PATH + 'secret/jwt-key.pub', 'utf8');
    }

    _provideJwtPrivateKey() {
        const fs = require('fs');
        return fs.readFileSync(CONFIG_BASE_PATH + 'secret/jwt-key.pem', 'utf8');
    }

    _provideSecretKey() {
        const fs = require('fs');
        return fs.readFileSync(CONFIG_BASE_PATH + 'secret/secret.key', 'utf8');
    }

    providePassport() {
        return this._passport;
    }

    getSecretKeyForStrategy(name) {
        for (let i = 0; i < this._strategies.length; i++) {
            let strategy = this._strategies[i];
            if (strategy && strategy.name === name) {
                return strategy.provideSecretKey();
            }
        }
    }

    _setPassportStrategies() {
        let passport = this._passport;
        this._strategies.forEach(function (strategy) {
            passport.use(strategy);
        });
    }

    signToken(strategyName, payload, options) {
        let key = this.getSecretKeyForStrategy(strategyName);
        switch (strategyName) {
            case 'jwt-rs-auth':
                return new JwtToken(
                    this._jwtTokenHandler.sign(payload,
                        key,
                        options)
                );
            default:
                throw new TypeError("Cannot sign toke for the " + strategyName + " strategy");
        }
    }
}
exports = module.exports = new AuthManager();