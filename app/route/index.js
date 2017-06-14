/**
 * Created by crosp on 6/7/17.
 */
const express = require('express'),
    router = express.Router();
// API V1
router.use('/v1', require(APP_ROUTE_PATH + 'v1'));

module.exports = router;