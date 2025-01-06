const express = require('express');
const router = express.Router();
const { searchUsers, sendFriendRequest, getFriendRequests, acceptFriendRequest, getFriendsList, removeFriend, rejectFriendRequest } = require('../controllers/friendController');

router.get('/add', searchUsers);  // Kullanıcı arama sayfası
router.post('/send-request', sendFriendRequest);  // İstek gönderme
router.get('/requests', getFriendRequests);  // Gelen istekleri listeleme
router.post('/accept', acceptFriendRequest);
router.get('/list',  getFriendsList);  // İsteği kabul etme
router.post('/remove', removeFriend);
router.post('/reject', rejectFriendRequest);

module.exports = router;
