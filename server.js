const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET || 'change_this_secret';

app.use(cors());
app.use(express.json());

// Simple in-memory user store (replace with DB in production)
const users = new Map(); 
// Example user for testing (password: "password123")
(async () => {
  const hash = await bcrypt.hash('password123', 10);
  users.set('test@example.com', { email: 'test@example.com', passwordHash: hash, data: { fullName: 'Test User', phone: '555-1234', address: '123 Main St' } });
})();

// Auth helpers
function generateToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '8h' });
}
function authenticateToken(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ error: 'Missing Authorization header' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Invalid Authorization format' });
  const token = parts[1];
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Routes
app.get('/', (req, res) => res.send('Server is running'));

// Register
app.post('/api/register',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    if (users.has(email)) return res.status(409).json({ error: 'User exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    users.set(email, { email, passwordHash, data: {} });
    return res.status(201).json({ ok: true });
  }
);

// Login
app.post('/api/login',
  body('email').isEmail(),
  body('password').exists(),
  async (req, res) => {
    const { email, password } = req.body;
    const u = users.get(email);
    if (!u) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, u.passwordHash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = generateToken({ email });
    return res.json({ token });
  }
);

// Protected endpoint for autofill: returns a specific field for the authenticated user
app.get('/api/userdata', authenticateToken, (req, res) => {
  const field = req.query.field;
  const u = users.get(req.user.email);
  if (!u) return res.status(404).json({ error: 'User not found' });
  const value = u.data && u.data[field];
  if (value === undefined) return res.status(404).json({ error: 'Field not found' });
  res.json({ value });
});

// Serve React build if present (production)
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, 'build');
  app.use(express.static(buildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
