const express = require('express');

const { isLoggedIn, isNotLoggedIn } = require('../middleware');
const { join, login, logout } = require('../controllers/auth');

const router = express.Router();

// POST /auth/join
router.route('/join')
.get( isNotLoggedIn,  (req, res, next) => {
    res.render('layout', { title:'회원가입' })
})
.post(isNotLoggedIn, join);

// POST /auth/login
router.post('/login', isNotLoggedIn, login);

// GET /auth/logout
router.get('/logout', isLoggedIn, logout);

module.exports = router;