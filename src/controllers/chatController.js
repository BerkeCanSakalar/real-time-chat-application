const User = require('../models/User');

exports.privateChatRoom = async (req, res) => {
    const userId = req.session.user.id;
    const friendId = req.params.friendId;

    try {
        const friend = await User.findById(friendId);

        if (!friend) {
            return res.status(404).send('Arkadaş bulunamadı!');
        }

        const roomId = [userId, friendId].sort().join('-'); // Benzersiz oda ismi oluştur
        res.render('chat/privateChat', {
            roomId,
            username: req.session.user.username,
            friendUsername: friend.username,
        });
    } catch (error) {
        console.error('Özel chat room hatası:', error);
        res.status(500).send('Bir hata oluştu.');
    }
};
