const jwt = require("jsonwebtoken");
require('dotenv').config();

const secret = process.env.APP_SECRET;

function generateToken(user) {
    try {
        const token = jwt.sign({ email: user.email, role: user.role }, secret, { expiresIn: '1h' });
        return token;
    } catch (error) {
        console.error('Error generating token:', error);
        throw new Error('Error generating token');
    }
};


function verifyToken(req, res, next) {

    const authHeader = req.headers["authorization"];

    if (!authHeader) return res.sendStatus(401);

    const token = authHeader.split(" ")[1]; 
    
    //the above is done because we assume a Bearer token system, so the token was sent as Bearer [token]

    jwt.verify(token, process.env.APP_SECRET, (err, user) => {

        if (err) return res.sendStatus(403);
        req.user = user;
        next();
        
    });

}

module.exports = {
    generateToken,
    verifyToken
};