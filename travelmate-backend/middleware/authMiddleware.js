const admin = require('firebase-admin');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  let token;

  // Check if the request has an "Authorization" header and if it starts with "Bearer "
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Extract the token from the header (Bearer <token>)
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify the token using the Firebase Admin SDK.
      // If the token is invalid or expired, this will throw an error.
      const decodedToken = await admin.auth().verifyIdToken(token);
      
      // 3. Use the UID from the verified token to find the corresponding user in our MongoDB database.
      // We attach this user object to the request (`req.user`) so that our controller functions can access it.
      req.user = await User.findOne({ firebaseUid: decodedToken.uid });

      // 4. Security check: if a user with that UID doesn't exist in our DB, deny access.
      if (!req.user) {
          return res.status(401).json({ message: 'Not authorized, user not found in database' });
      }

      // 5. If everything is successful, call next() to proceed to the actual controller function.
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };