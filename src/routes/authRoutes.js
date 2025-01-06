const express = require('express');
const router = express.Router();
const { registerForm, register, loginForm, login, forgotPasswordForm, resetPassword, logout } = require('../controllers/authController');

// Kayıt ve giriş formunu gösteren route'lar
router.get('/register', registerForm); // GET /auth/register -> Kayıt formu
router.post('/register', register); // POST /auth/register -> Kayıt işlemi
router.get('/login', loginForm); // GET /auth/login -> Giriş formu
router.post('/login', login); // POST /auth/login -> Giriş işlemi
router.get('/forgot-password', forgotPasswordForm);  // GET /auth/forgot-password
router.post('/forgot-password', resetPassword);  // POST /auth/forgot-password
router.get('/logout', logout);
  
  

module.exports = router;
