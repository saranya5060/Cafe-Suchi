const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('./users.db');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// Serve static HTML files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Create users table if not exists
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
)`);

// Home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Registration page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Handle registration
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], function(err) {
        if (err) {
            return res.send('Registration failed. Username may already exist.');
        }
        res.send('Registration successful! <a href="/login">Login here</a>');
    });
});

// Handle login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
        if (row) {
            res.redirect('/home');
        } else {
            res.send('Login failed. Invalid credentials.');
        }
    });
});

// Home page after login
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
