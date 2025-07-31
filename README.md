# Rematch Türkiye Community Website

This project is a modern web application I developed for the Rematch Türkiye community. It is designed as a platform where community members can interact, get information about events, and communicate with each other.

## Technologies Used

**Backend:** Node.js, Express.js, MongoDB  
**Frontend:** EJS, HTML5, CSS3, JavaScript, Bootstrap 5  
**Authentication:** bcryptjs, express-session  
**Tools:** Mongoose ODM, Multer, Nodemon

## Project Features

- User registration and login system
- Responsive design (mobile-friendly)
- File upload functionality
- Contact form
- Modern user interface
- Session-based authentication

## 🚀 Installation

1. **Clone the repository:**
```bash
git clone https://github.com/kullaniciadi/rematch-turkiye-website.git
cd rematch-turkiye-website
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start MongoDB:**
- Use MongoDB Compass or MongoDB Community Server
- Or use MongoDB Atlas (cloud)

4. **Environment variables (optional):**
Create a `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/community-website
SESSION_SECRET=your-secret-key
PORT=3000
```

5. **Start the application:**
```bash
npm start
```

6. **Open in browser:**
```
http://localhost:3000
```

## 📁 Project Structure

```
├── models/          # MongoDB models
├── routes/          # API routes
├── views/           # EJS templates
├── public/          # Static files (CSS, JS, images)
├── middleware/      # Custom middlewares
├── server.js        # Main application file
└── package.json     # Project dependencies
```

## What I Learned

Through this project:
- Backend development with Node.js and Express.js
- MongoDB database management and Mongoose ODM usage
- User authentication and security
- Responsive web design
- RESTful API development
- File upload operations

## Contact

For questions about this project: ataerbozdemir@gmail.com
