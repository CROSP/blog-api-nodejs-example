/**
 * Created by crosp on 5/8/17.
 */
const router = require('express').Router();
const UserController = require(APP_CONTROLLER_PATH + 'user');
let userController = new UserController();

router.get('/:id', userController.get);
router.post('/', userController.create);

module.exports = router;
