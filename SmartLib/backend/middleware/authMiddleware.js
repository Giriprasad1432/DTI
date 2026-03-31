import jwt from 'jsonwebtoken';

/**
 * Middleware to verify JSON Web Token (JWT) from the Authorization header.
 * Attaches decoded user info (id, role) to req.user if successful.
 */
export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Expecting "Bearer <token>"

        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        const secret = process.env.JWT_SECRET || 'your_secret_key_here';
        const decoded = jwt.verify(token, secret);
        
        req.user = decoded; // Contains { id, role, ... }
        next();
    } catch (err) {
        console.error('JWT Verification Error:', err.message);
        return res.status(403).json({ error: 'Invalid or expired token.' });
    }
};

/**
 * Middleware to restrict access to Admins only.
 * Must be used AFTER verifyToken.
 */
export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Access denied. Administrative privileges required.' });
    }
};
