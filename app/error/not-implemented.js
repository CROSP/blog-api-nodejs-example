/**
 * Created by crosp on 5/11/17.
 */

'use strict';
const BaseError = require(APP_ERROR_PATH + 'base');

class NotImplemented extends BaseError {
    constructor(message) {
        super(message, 501);
    }
}

module.exports = NotImplemented;