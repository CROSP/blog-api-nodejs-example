/**
 * Created by crosp on 5/9/17.
 */
const RevokedToken = require(APP_MODEL_PATH + 'auth/revoked-token').RevokedTokenModel;
const NotFoundError = require(APP_ERROR_PATH + 'invalid-payload');
const BaseAutoBindedClass = require(APP_BASE_PACKAGE_PATH + 'base-autobind');
let crypto = require('crypto');
const SHA_HASH_LENGTH = 64;
const ForbiddenError = require(APP_ERROR_PATH + 'forbidden');

class AuthHandler extends BaseAutoBindedClass {
    constructor() {
        super();
        this._jwtTokenHandler = require('jsonwebtoken');
        this._authManager = require(APP_MANAGER_PATH + 'auth');
    }

    issueNewToken(req, user, callback) {
        let that = this;
        if (user) {
            let userToken = that._authManager.signToken("jwt-rs-auth", that._provideTokenPayload(user), that._provideTokenOptions());
            callback.onSuccess(userToken);
        }
        else {
            callback.onError(new NotFoundError("User not found"));
        }
    }

    revokeToken(req,token, callback) {
        let that = this;
        req.checkParams('token', 'Invalid token id provided').notEmpty().isAlphanumeric().isLength(SHA_HASH_LENGTH);
        req.getValidationResult()
            .then((result) => {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ForbiddenError('Invalid token id :' + errorMessages.join(' && '));
                }
                let tokenHashedId = req.params.token;
                if (that.checkIfHashedTokenMatches(token, tokenHashedId)) {
                    return new RevokedToken({token: token});
                }
                else {
                    throw new ForbiddenError('Invalid credentials');
                }
            })
            .then((token) => {
                token.save();
                return token;
            })
            .then((token) => {
                callback.onSuccess("Token has been successfully revoked");
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    _hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    checkIfHashedTokenMatches(token, hashed) {
        let hashedValid = this._hashToken(token);
        return hashedValid === hashed;
    }


    _provideTokenPayload(user) {
        return {
            id: user.id,
            scope: 'default'
        };
    }

    _provideTokenOptions() {
        let config = global.config;
        return {
            expiresIn: "10 days",
            audience: config.jwtOptions.audience,
            issuer: config.jwtOptions.issuer,
            algorithm: config.jwtOptions.algorithm
        };
    }


}

module.exports = AuthHandler;