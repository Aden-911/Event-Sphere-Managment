const jwt = require('jsonwebtoken');

const User = require('../Models/UserSchema'); // you'll need this for fetching user details

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach full user object (without password)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // go to route
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: 'Invalid token' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};


// Middleware to protect routes
const adminOnly = (req, res, next) => {
    let token;

    // Check if token is in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        try {
            // Extract token from the header
            token = req.headers.authorization.split(' ')[1]; // 'Bearer token'

            // Verify the token using JWT_SECRET
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach the user to the request object
            req.user = decoded; // decoded contains the user _id and role

            // Check if the user is an admin
            if (req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Forbidden, admin access required' });
            }

            next(); // Continue to the next middleware/route handler
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // If no token is present
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = adminOnly;
module.exports =  protect;
