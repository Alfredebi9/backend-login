const dotenv = require('dotenv').config();
const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: true,
  saveUninitialized: true
}));

mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

const userSchema = new mongoose.Schema({
  name: String,
  password: String
});

const User = mongoose.model('User', userSchema);

app.post('/users/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    const user = new User({
      name: req.body.name,
      password: hashedPassword
    });

    await user.save();

    req.session.user = user;
    res.redirect('/');
  } catch (error) {
    res.status(500).send();
  }
});

app.post('/users/login', async (req, res) => {
  try {
    const user = await User.findOne({ name: req.body.name });

    if (!user) {
      alert("Cannot find user");
    }

    if (await bcrypt.compare(req.body.password, user.password)) {
      req.session.user = user;
      res.redirect('/');
    } else {
      alert('Not Allowed');
    }
  } catch (error) {
    res.status(500).send();
  }
});

app.get('/users/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send();
    }
    res.redirect('/');
  });
});

app.get('/', (req, res) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname, "public", "homepage.html"));
  } else {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  }
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});