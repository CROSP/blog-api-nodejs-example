/**
 * Created by crosp on 5/9/17.
 */
const autoBind = require('auto-bind');

class BaseAutoBindedClass {
    constructor() {
        autoBind(this);
    }
}
module.exports = BaseAutoBindedClass;