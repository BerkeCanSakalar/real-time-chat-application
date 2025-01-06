const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

const authMiddleware = (req, res, next) => {
    if (!req.session || !req.session.user) {
      return res.redirect('/auth/login');  // Oturum yoksa giriş sayfasına yönlendir
    }
    next();
  };

router.get('/', authMiddleware, (req, res) => {
  res.render('chat/chatRoom', { username: req.session.user.username });
});
router.get('/private/:friendId', chatController.privateChatRoom);

module.exports = router;
