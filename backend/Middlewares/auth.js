const jwt = require('jsonwebtoken');
const User = require('../Models/user'); // Adjust the path to your User model

const secretKey = process.env.SECRET_KEY;

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, secretKey);
        const user = await User.findOne({ _id: decoded.userId });


        if (!user) {
            throw new Error('User not found');
        }

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate.' });
    }
};

module.exports = auth;
