const { v4: uuidv4 } = require('uuid');
const { query } = require('../config/db');
const { generateToken, hashPassword, comparePassword } = require('../config/auth');

const userController = {
    // User registration
    register: async (req, res) => {
        try {
            const { username, email, password } = req.body;

            // check user already exists
            const existingUser = await query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
            if (existingUser.length > 0) {
                return res.status(400).json({ message: 'Username or email already exists' });
            }

            // hash the password
            const hashedPassword = await hashPassword(password);

            const id = uuidv4();
            await query('INSERT INTO users (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)',
                [id, username, email, hashedPassword, 'user']);

            res.status(201).json({ message: 'User created successfully' });

        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    registerAdmin: async (req, res) => {
        try {
            const { username, email, password } = req.body;

            // check admin already exists
            const existingUser = await query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);

            if (existingUser.length > 0) {
                return res.status(400).json({ message: 'Username or email already exists' });
            }

            // hash the password
            const hashedPassword = await hashPassword(password);

            // Create new user
            const id = uuidv4();

            await query('INSERT INTO users (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)', [id, username, email, hashedPassword, 'admin']);

            res.status(201).json({ message: 'Admin created successfully' });

        } catch (error) {
            console.error('Error registering Admin:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },


    // User login
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            // find the user
            const userResult = await query('SELECT * FROM users WHERE username = ?', [username]);

            if (userResult.length === 0) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            const user = userResult[0];

            // check password
            const passwordMatch = await comparePassword(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }


            const token = generateToken(user);

            res.json({ token, message: 'Login successful' });

        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // get user details
    getUserDetails: async (req, res) => {
        try {

            const userId = req.user.userId;

            const userResult = await query('SELECT id, username, email, role FROM users WHERE id = ?', [userId]);
            if (userResult.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            const user = userResult[0];
            res.json(user);

        } catch (error) {
            console.error('Error fetching user details:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
};

module.exports = userController;