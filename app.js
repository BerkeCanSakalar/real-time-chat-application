require('dotenv').config();
const express = require('express');
const http = require('http');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const { Server } = require('socket.io');
const path = require('path');
const authRoutes = require('./src/routes/authRoutes');
const chatRoutes = require('./src/routes/chatRoutes');
const mongoose = require('./src/utils/db');
const socketHandler = require('./src/utils/socketHandler');
const friendRoutes = require('./src/routes/friendRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
  }),
  cookie: { maxAge: 1000 * 60 * 60 },
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;  // Varsayılan boş dizi
  next();
});

app.use(cors());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './src/views'));
app.use(express.static(path.join(__dirname, 'src/views/public')));

// Routes
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);
app.use('/friends', friendRoutes);

app.get('/', (req, res) => {
  res.render('index');
});

// Socket.io
socketHandler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor...`));
