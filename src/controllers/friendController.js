const User = require('../models/User');

// Kullanıcıları arama ve listeleme
exports.searchUsers = async (req, res) => {
    try {
        const searchQuery = req.query.username?.trim() || '';
        const user = await User.findById(req.session.user.id).populate('friends'); // Arkadaş listesini al
        let users = [];

        let showResults = false;  // Arama yapılmadan sonuçlar gösterilmesin

        if (searchQuery.length > 0) {
            users = await User.find({
                username: { $regex: searchQuery, $options: 'i' },
                _id: { $ne: req.session.user.id } // Kendini listeleme
            }).limit(10);
            showResults = true;  // Arama yapıldığında sonuçları göster
        }

        res.render('friends/addFriend', { users, user, showResults });
    } catch (error) {
        console.error('Kullanıcı arama hatası:', error);
        res.render('friends/addFriend', { users: [], error: 'Bir hata oluştu.', showResults: false });
    }
};


// Arkadaşlık isteği gönder
exports.sendFriendRequest = async (req, res) => {
    try {
        const friendId = req.body.friendId;  // Hedef kullanıcının ID'si
        const userId = req.session.user.id.toString();  // Oturumdaki kullanıcının ID'si

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!friend) return res.status(404).send('Kullanıcı bulunamadı!');

        // Kullanıcı kendi adına istek göndermesin
        if (userId === friendId) {
            return res.status(400).send('Kendinize arkadaşlık isteği gönderemezsiniz.');
        }

        // Daha önce istek gönderilmiş mi kontrol et
        if (friend.friendRequests.some(req => req.from.toString() === userId)) {
            return res.status(400).send('Zaten arkadaşlık isteği gönderildi.');
        }

        friend.friendRequests.push({ from: user._id, status: 'pending' });
        await friend.save();
        res.redirect('/friends/add');
    } catch (error) {
        console.error('Arkadaşlık isteği gönderme hatası:', error);
        res.status(500).send('Bir hata oluştu.');
    }
};

// Gelen istekleri listele ve kabul etme işlemi
exports.getFriendRequests = async (req, res) => {
    try {
        const userId = req.session.user.id.toString();
        const user = await User.findById(userId).populate('friendRequests.from');

        if (!user) {
            return res.status(404).send('Kullanıcı bulunamadı.');
        }

        res.render('friends/friendRequests', { requests: user.friendRequests });
    } catch (error) {
        console.error('İstekleri getirme hatası:', error);
        res.status(500).send('Bir hata oluştu.');
    }
};

// İsteği kabul et
exports.acceptFriendRequest = async (req, res) => {
    try {
        const userId = req.session.user.id.toString();
        const requestId = req.body.requestId;

        const user = await User.findById(userId);
        const request = user.friendRequests.find(req => req._id.toString() === requestId);

        if (!request) return res.status(404).send('İstek bulunamadı.');

        const friend = await User.findById(request.from);

        // Zaten arkadaş mı kontrol et
        if (!user.friends.some(friendId => friendId.toString() === friend._id.toString())) {
            user.friends.push(friend._id);
        }

        if (!friend.friends.some(friendId => friendId.toString() === user._id.toString())) {
            friend.friends.push(user._id);
        }

        user.friendRequests = user.friendRequests.filter(req => req._id.toString() !== requestId);
        await user.save();
        await friend.save();

        res.redirect('/friends/requests');
    } catch (error) {
        console.error('İstek kabul hatası:', error);
        res.status(500).send('Bir hata oluştu.');
    }
};

// Arkadaş listesi gösterme
exports.getFriendsList = async (req, res) => {
    try {
        const userId = req.session.user.id.toString();
        const user = await User.findById(userId).populate('friends', 'username email');

        if (!user) {
            return res.status(404).send('Kullanıcı bulunamadı.');
        }

        res.render('friends/friendList', { friends: user.friends });
    } catch (error) {
        console.error('Arkadaş listesi hatası:', error);
        res.status(500).send('Bir hata oluştu.');
    }
};

// Arkadaşlıktan çıkarma
exports.removeFriend = async (req, res) => {
    try {
        const userId = req.session.user.id.toString();  // Oturumdaki kullanıcının ID'si
        const friendId = req.body.friendId;  // Çıkartılacak arkadaşın ID'si

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!friend) return res.status(404).send('Arkadaş bulunamadı.');

        // Arkadaş listesinden çıkar
        user.friends = user.friends.filter(f => f.toString() !== friendId);
        friend.friends = friend.friends.filter(f => f.toString() !== userId);

        await user.save();
        await friend.save();

        res.redirect('/friends/list');  // Arkadaş listesine geri yönlendirme
    } catch (error) {
        console.error('Arkadaşlıktan çıkarma hatası:', error);
        res.status(500).send('Bir hata oluştu.');
    }
};

// Arkadaşlık isteğini reddet
exports.rejectFriendRequest = async (req, res) => {
    try {
        const requestId = req.body.requestId; // Formdan gelen requestId
        const user = await User.findById(req.session.user.id);

        if (!user) {
            return res.status(404).send('Kullanıcı bulunamadı.');
        }

        // İstek listesinden isteği sil
        user.friendRequests = user.friendRequests.filter(req => !req._id.equals(requestId));

        await user.save(); // Değişiklikleri kaydet
        res.redirect('/friends/requests'); // Arkadaşlık istekleri sayfasına geri dön
    } catch (error) {
        console.error('Arkadaşlık isteği reddetme hatası:', error);
        res.status(500).send('Bir hata oluştu.');
    }
};
