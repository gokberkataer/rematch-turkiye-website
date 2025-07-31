# Rematch Türkiye Community Website

Bu proje, Rematch Türkiye topluluğu için geliştirdiğim modern web uygulamasıdır. Topluluk üyelerinin etkileşim kurabileceği, etkinlikler hakkında bilgi alabileceği ve birbirleriyle iletişim kurabileceği bir platform olarak tasarlanmıştır.

## Kullanılan Teknolojiler

**Backend:** Node.js, Express.js, MongoDB  
**Frontend:** EJS, HTML5, CSS3, JavaScript, Bootstrap 5  
**Authentication:** bcryptjs, express-session  
**Tools:** Mongoose ODM, Multer, Nodemon

## Proje Özellikleri

- Kullanıcı kayıt ve giriş sistemi
- Responsive tasarım (mobil uyumlu)
- Dosya yükleme özelliği
- İletişim formu
- Modern kullanıcı arayüzü
- Session tabanlı kimlik doğrulama

## 🚀 Kurulum

1. **Repository'yi klonlayın:**
```bash
git clone https://github.com/kullaniciadi/rematch-turkiye-website.git
cd rematch-turkiye-website
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **MongoDB'yi başlatın:**
- MongoDB Compass veya MongoDB Community Server kullanın
- Veya MongoDB Atlas (cloud) kullanın

4. **Environment variables (isteğe bağlı):**
`.env` dosyası oluşturun:
```
MONGODB_URI=mongodb://localhost:27017/community-website
SESSION_SECRET=your-secret-key
PORT=3000
```

5. **Uygulamayı başlatın:**
```bash
npm start
```

6. **Tarayıcıda açın:**
```
http://localhost:3000
```

## 📁 Proje Yapısı

```
├── models/          # MongoDB modelleri
├── routes/          # API routes
├── views/           # EJS template'leri
├── public/          # Static dosyalar (CSS, JS, images)
├── middleware/      # Custom middleware'ler
├── server.js        # Ana uygulama dosyası
└── package.json     # Proje bağımlılıkları
```

## Öğrendiğim Konular

Bu proje sayesinde:
- Node.js ve Express.js ile backend geliştirme
- MongoDB veritabanı yönetimi ve Mongoose ODM kullanımı
- Kullanıcı kimlik doğrulama ve güvenlik
- Responsive web tasarımı
- RESTful API geliştirme
- Dosya yükleme işlemleri


## İletişim

Bu proje hakkında sorularınız için: ataerbozdemir@gmail.com
