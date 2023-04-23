const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const passport = require('passport');
require('./passport'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const http = require("http");
const socketIo = require("socket.io");
const cookieParser = require('cookie-parser');
const fs = require('fs');
const https = require('https');

dotenv.config();





const PORT = process.env.PORT || 3000;
const app = express();
const server = https.createServer(app); // Замените http.createServer на https.createServer

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: ['https://localhost:8080', 'http://localhost:8080','http://192.168.100.3:8080', 'https://192.168.100.3:8080'],
  credentials: true,
};

app.use(cors(corsOptions));

const io = socketIo(server, {
  cors: {
    origin: ['https://localhost:8080', 'http://localhost:8080','http://192.168.100.3:8080', 'https://192.168.100.3:8080'],
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});



app.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err });
  }
});

app.get('/rooms', async (req, res) => {
  try {
    const rooms = await prisma.room.findMany();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching rooms' });
  }
});

app.use(passport.initialize());

app.post('/', (req, res) => {
  // Ваша логика здесь
  res.status(200).json({ message: 'Success' });
});

app.post('/login', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { email: req.body.email } });

    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true });
    res.json({ success: true, message: 'Logged in successfully.' });

  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});
app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully.' });
});

app.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});


io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("join", (roomId) => {
    socket.join(roomId);
  });

  socket.on("signal", (data) => {
    io.to(data.roomId).emit("signal", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});




