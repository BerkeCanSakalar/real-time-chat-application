const mongoose = require('mongoose');
const bcrypt = require('bcrypt');



const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  // Arkadaş listesi
  friendRequests: [{ from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, status: String }]  // İstekler
}, { timestamps: true });

// Şifreyi kaydetmeden önce hash'leme
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();  // Sadece şifre değiştiyse hash'le
  const salt = await bcrypt.genSalt(10);  // Salt oluştur
  this.password = await bcrypt.hash(this.password, salt);  // Şifreyi hash'le
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
