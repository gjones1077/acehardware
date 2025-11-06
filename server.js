const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const users = {}; // Store users in memory for this example
const SECRET_KEY = 'your_secret_key'; // Use a strong secret key in production

// User Registration with Validation
app.post('/api/register', [
    body('username').isLength({ min: 3 }),
    body('password').isLength({ min: 6 }),
    body('fullName').notEmpty() // New field validation
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { username, password, fullName, phone, address } = req.body;
    if (users[username]) {
        return res.status(400).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // Store additional user data
    users[username] = { 
        password: hashedPassword,
        fullName: fullName,
        phone: phone,
        address: address
    };
    res.status(201).json({ message: 'User registered successfully' });
});

// User Login with Validation
app.post('/api/login', [
    body('username').notEmpty(),
    body('password').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    const user = users[username];
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.sendStatus(403); // Forbidden
    }
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        req.user = user; // Save user info for later use
        next();
    });
};

// Protect the userdata endpoint
app.get('/api/userdata', authenticateJWT, (req, res) => {
    const { field } = req.query;
    const userId = req.user.username; // Use the username from the token

    if (!users[userId]) {
        return res.status(404).json({ error: 'User not found' });
    }

    const userData = users[userId][field];
    if (userData) {
        return res.json({ value: userData });
    } else {
        return res.status(400).json({ error: 'Field not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
