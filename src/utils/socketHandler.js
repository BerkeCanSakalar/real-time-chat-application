const crypto = require('crypto');
const Message = require('../models/Message');

const secretKey = process.env.SESSION_SECRET.padEnd(32, '0').slice(0, 32);  // 32 karaktere göre ayarlanıyor (AES-256)

// Şifreleme fonksiyonu
function encryptMessage(message) {
    const iv = crypto.randomBytes(16);  // Initialization Vector (IV)
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
    let encrypted = cipher.update(message, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { iv: iv.toString('hex'), encryptedData: encrypted };
}

// Şifre çözme fonksiyonu
function decryptMessage(encryptedMessage) {
    const iv = Buffer.from(encryptedMessage.iv, 'hex');
    const encryptedText = Buffer.from(encryptedMessage.encryptedData, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`Bir kullanıcı bağlandı: ${socket.id}`);

        // Odaya katılma
        socket.on('joinRoom', async ({ roomId, username }) => {
            socket.join(roomId);

            // Oda mesajlarını yükle ve çöz
            const messages = await Message.find({ roomId }).sort({ createdAt: 1 });
            const decryptedMessages = messages.map(msg => ({
                username: msg.username,
                message: decryptMessage({ iv: msg.iv, encryptedData: msg.message }),
                createdAt: msg.createdAt
            }));
            socket.emit('previousMessages', decryptedMessages);
        });

        // Mesaj gönderme
        socket.on('sendMessage', async ({ roomId, username, message }) => {
            if (roomId && message.trim()) {
                // Mesajı şifrele
                const encryptedMessage = encryptMessage(message);

                // Mesajı veritabanına kaydet
                const newMessage = new Message({
                    roomId,
                    username,
                    message: encryptedMessage.encryptedData,
                    iv: encryptedMessage.iv
                });
                await newMessage.save();

                io.to(roomId).emit('receiveMessage', { username, message });
            }
        });

        // Mesajları temizleme
        socket.on('clearMessages', async (roomId) => {
            await Message.deleteMany({ roomId });
            io.to(roomId).emit('clearMessagesClient');
        });

        // Özel odaya katılım
        socket.on('joinPrivateRoom', async ({ roomId, username }) => {
            socket.join(roomId);

            // Oda mesajlarını yükle ve çöz
            const messages = await Message.find({ roomId }).sort({ createdAt: 1 });
            const decryptedMessages = messages.map(msg => ({
                username: msg.username,
                message: decryptMessage({ iv: msg.iv, encryptedData: msg.message }),
                createdAt: msg.createdAt
            }));
            socket.emit('previousMessages', decryptedMessages);

            console.log(`${username} odaya katıldı: ${roomId}`);
        });

        // Özel mesaj gönderimi
        socket.on('sendPrivateMessage', async ({ roomId, username, message }) => {
            if (roomId && message.trim()) {
                // Mesajı şifrele
                const encryptedMessage = encryptMessage(message);

                // Mesajı veritabanına kaydet
                const newMessage = new Message({
                    roomId,
                    username,
                    message: encryptedMessage.encryptedData,
                    iv: encryptedMessage.iv
                });
                await newMessage.save();

                io.to(roomId).emit('receivePrivateMessage', { username, message });
            }
        });

        // Ayrılma
        socket.on('disconnect', () => {
            console.log('Bir kullanıcı ayrıldı:', socket.id);
        });
    });
};
