const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const localDb = require('../lib/localDb');
const { supabase } = require('../lib/supabase');

const JWT_SECRET = process.env.JWT_SECRET || 'rk-secret-key-2024';

// POST Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const users = localDb.getUsers();
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password: hashedPassword,
            created_at: new Date().toISOString()
        };

        users.push(newUser);
        localDb.saveUsers(users);

        const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
        
        const { password: _, ...userSansPassword } = newUser;
        res.status(201).json({ user: userSansPassword, token });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});

// POST Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required' });
        }

        const users = localDb.getUsers();
        const user = users.find(u => u.email === email);
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        
        const { password: _, ...userSansPassword } = user;
        res.status(200).json({ user: userSansPassword, token });
    } catch (error) {
        res.status(500).json({ message: 'Login error', error: error.message });
    }
});

module.exports = router;
