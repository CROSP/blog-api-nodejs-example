/**
 * Created by crosp on 5/12/17.
 */
/**
 * Created by crosp on 5/9/17.
 */
const BasePassportStrategy = require('passport-strategy');

class BaseAuthStrategy extends BasePassportStrategy {
    constructor() {
        super();
    }

    _initStrategy() {
        throw new Error("Not Implemented");
    }

    authenticate(req) {
        throw new Error("Not Implemented");
    }

    authenticate(req, options) {
        throw new Error("Not Implemented");
    }

    get name() {
        throw new Error("Not Implemented");
    }

    provideOptions() {
        throw new Error("Not Implemented");
    }

    provideSecretKey() {
        throw new Error("Not Implemented");
    }
}

exports = module.exports = BaseAuthStrategy;