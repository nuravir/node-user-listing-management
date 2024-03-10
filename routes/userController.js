const express = require('express');
const auth = require('../middleware/authorization');
const User = require('../models/user');

const router = express.Router();


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the username and password match

        // const user = users.find(u => u.email === email && u.password === password); 

        const user = await User.findOne({ email, password });
        if (user) {
            const token = auth.generateToken(user);;
            res.json({ token });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
        
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/signup', async (req, res) => {
    try {
        const { email, password, role} = req.body;
        const user = new User({ email, password, role });
        await user.save();
        const token = auth.generateToken(user);
        res.json({ token, user });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;