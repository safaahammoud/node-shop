const express = require('express');
const router = express.Router();
const UserController = require('../middleware/controllers/users');

router.post('/signup', UserController.signup);

router.post('/login', UserController.login);

router.delete('/:userId', UserController.delete);

module.exports = router;