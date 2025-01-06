🛠️ Gerçek Zamanlı Sohbet Uygulaması
Bu proje, kullanıcıların genel sohbet kanallarına katılabileceği, arkadaşlık istekleri gönderebileceği ve arkadaş listelerindeki kişilerle özel mesajlaşma yapabileceği bir gerçek zamanlı chat uygulamasıdır. Modern bir arayüze sahiptir.

⚙️ Teknik Gereksinimler
Node.js: 18.x veya daha yeni bir sürüm
MongoDB: Veritabanı bağlantısı için gerekli

🌟 Proje Özellikleri
1. Genel Sohbet Alanı
Farklı sohbet kanallarına katılabilir ve mesaj gönderebilirsiniz.
Mesajlar gerçek zamanlı olarak güncellenir.
2. Arkadaş Yönetimi
Arkadaşlık isteği gönderebilir, kabul edebilir veya reddedebilirsiniz.
Arkadaş listesi üzerinden kişisel sohbet başlatabilirsiniz.
3. Özel Sohbetler
Arkadaşlarınızla birebir özel mesajlaşabilirsiniz.
Dosya ve resim gönderimi yapılabilir.
4. Oturum Yönetimi
Kullanıcı giriş/çıkış sistemi ile güvenli kimlik doğrulama.
"Şifreyi Unuttum" seçeneği ile şifre sıfırlama.

Gereksinimler Projeyi çalıştırmadan önce aşağıdaki gereksinimlerin kurulu olduğundan emin olun:

Node.js (v18 veya üstü): Node.js İndir MongoDB (Yerel veya Bulut Bağlantısı - MongoDB Atlas)

Gerekli Paketlerin Yüklenmesi Tüm bağımlılıkları yüklemek için:

"npm install"

.env Dosyası Oluşturun Proje kök dizininde bir .env dosyası oluşturun ve aşağıdaki örneği kullanarak gerekli bilgileri doldurun:

MONGO_URI="Your Mongodb Connection Link" 
PORT="3000" 
SESSION_SECRET="Your Secret Key" 
JWT_SECRET="Your JWT Secret Key"

çalıştımak için bu komutu terminale yapıştıırn 
"npm install --save-dev nodemon"

Çalıştırma Projenizi aşağıdaki komutla başlatabilirsiniz: 
"npm run dev"

başlatırken eğer hata alırsanız package.json dosyasında bu kodlar var mı kontrol edin. 
"scripts": { "start": "node app.js", "dev": "nodemon app.js" },


📌 Lisans
Bu proje MIT lisansı ile lisanslanmıştır. Daha fazla bilgi için LICENSE dosyasına bakın.
