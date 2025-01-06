const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


// Kullanıcı kaydı
exports.registerForm = (req, res) => {
  res.render('auth/register'); // Kayıt formunu render et
};

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Kullanıcı zaten var mı kontrol et
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('auth/register', { error: 'Bu email zaten kayıtlı!' });
    }

    const user = new User({ username, email, password });
    await user.save();

    res.redirect('/auth/login'); // Kayıt başarılıysa giriş sayfasına yönlendir
  } catch (error) {
    res.render('auth/register', { error: 'Bir hata oluştu, lütfen tekrar deneyin.' });
  }
};

// Kullanıcı giriş
exports.loginForm = (req, res) => {
  res.render('auth/login'); // Giriş formunu render et
};

exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email })
    .populate('friends', '_id username')
    .populate('friendRequests.from', '_id');
    const sentRequests = await User.find({ 'friendRequests.from': user._id }).select('_id');
      if (!user) {
        return res.render('auth/login', { error: 'Email veya şifre hatalı!' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);  // Şifre karşılaştırması
  
      if (!isPasswordValid) {
        return res.render('auth/login', { error: 'Email veya şifre hatalı!' });
      }
  
      req.session.user = {
        id: user._id,
        username: user.username,
        friends: user.friends.map(friend => friend._id.toString()),
        sentRequests: sentRequests.map(req => req._id.toString())  // Arkadaş listesi
      };
  
      res.redirect('/chat');
    } catch (error) {
      console.error('Giriş sırasında hata:', error);
      res.render('auth/login', { error: 'Bir hata oluştu, lütfen tekrar deneyin.' });
    }
  };
  

// Şifre sıfırlama formunu render et
exports.forgotPasswordForm = (req, res) => {
    res.render('auth/forgotPassword');  // Şifre sıfırlama sayfasını render et
  };
  
  // Şifre sıfırlama işlemi
  exports.resetPassword = async (req, res) => {
    try {
      const { email, newPassword } = req.body;
  
      // Kullanıcıyı bul
      const user = await User.findOne({ email });
      if (!user) {
        return res.render('auth/forgotPassword', { error: 'Bu e-posta ile kayıtlı hesap bulunamadı.' });
      }
  
      // Şifreyi direkt atayalım, modelde `pre('save')` ile hash'lenecek
      user.password = newPassword;
      await user.save();  // `pre('save')` hash'leme yapacak
  
      res.redirect('/auth/login');  // Başarılı olursa giriş sayfasına yönlendir
    } catch (error) {
      console.error('Şifre sıfırlama hatası:', error);
      res.render('auth/forgotPassword', { error: 'Bir hata oluştu, lütfen tekrar deneyin.' });
    }
  };
  
  exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Çıkış sırasında hata:', err);
            return res.status(500).send('Çıkış işlemi sırasında bir hata oluştu.');
        }
        res.clearCookie('connect.sid');  // Session cookie temizleniyor
        res.redirect('/auth/login');  // Giriş sayfasına yönlendirme
    });
};
