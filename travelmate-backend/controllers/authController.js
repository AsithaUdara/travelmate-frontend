// controllers/authController.js
const admin = require('firebase-admin');
const https = require('https');
const { URL } = require('url');
const User = require('../models/userModel'); // Import our User model

// @desc    Register a new user in Firebase and MongoDB
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    // --- Step 1: Create the user in Firebase Authentication ---
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: name,
    });

    // --- Step 2: Save the user to our MongoDB database ---
    // We link the MongoDB user to the Firebase user via the UID
    const newUser = new User({
      firebaseUid: userRecord.uid,
      name,
      email,
    });

    await newUser.save();

    // --- Step 3: Send a success response ---
    res.status(201).json({
      message: 'User created successfully!',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        name: name,
      },
    });

  } catch (error) {
    console.error('Error in user registration:', error);

    // Provide a more specific error message if the email is already in use
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ message: 'That email address is already in use.' });
    }

    // Generic error for other issues
    res.status(500).json({ message: 'Server error during user registration.' });
  }
};

// @desc    Login user with email/password, return Firebase Custom Token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const apiKey = process.env.FIREBASE_WEB_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      message: 'Server misconfiguration: FIREBASE_WEB_API_KEY is missing. Add it to your backend .env.'
    });
  }

  try {
    // Use Firebase Identity Toolkit to verify email/password and get the userId (localId)
    const endpoint = new URL(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`);
    const body = JSON.stringify({ email, password, returnSecureToken: true });

    const data = await new Promise((resolve, reject) => {
      const reqOpts = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      };
      const reqHttps = https.request(endpoint, reqOpts, (resp) => {
        let raw = '';
        resp.setEncoding('utf8');
        resp.on('data', (chunk) => (raw += chunk));
        resp.on('end', () => {
          try {
            const parsed = JSON.parse(raw || '{}');
            if (resp.statusCode && resp.statusCode >= 200 && resp.statusCode < 300) {
              resolve(parsed);
            } else {
              resolve({ error: { message: parsed.error?.message || 'UNKNOWN_ERROR' } });
            }
          } catch (e) {
            reject(e);
          }
        });
      });
      reqHttps.on('error', reject);
      reqHttps.write(body);
      reqHttps.end();
    });

    if (data && data.error && data.error.message) {
      // Map common Firebase errors
      const code = data.error.message;
      let message = 'Invalid credentials.';
      if (code === 'EMAIL_NOT_FOUND') message = 'Email not found.';
      else if (code === 'INVALID_PASSWORD') message = 'Incorrect password.';
      else if (code === 'USER_DISABLED') message = 'User account disabled.';
      return res.status(400).json({ message });
    }

    const uid = data.localId; // Firebase UID

    // Ensure a user record exists in MongoDB (optional upsert)
    const existing = await User.findOne({ firebaseUid: uid });
    if (!existing) {
      await User.create({ firebaseUid: uid, email: data.email || email, name: data.displayName || email.split('@')[0] });
    }

    // Mint a custom token for the frontend to sign in with
    const customToken = await admin.auth().createCustomToken(uid);
    return res.json({ token: customToken });
  } catch (error) {
    console.error('Error during loginUser:', error);
    return res.status(500).json({ message: 'Server error during login.' });
  }
};

// @desc    Upsert user after social login on client; no token minting required here
// @route   POST /api/auth/social-login
// @access  Public
exports.socialLogin = async (req, res) => {
  try {
    const { firebaseUid, email, name } = req.body || {};
    if (!firebaseUid) {
      return res.status(400).json({ message: 'firebaseUid is required.' });
    }

    const update = {
      ...(email ? { email } : {}),
      ...(name ? { name } : {}),
    };

    const user = await User.findOneAndUpdate(
      { firebaseUid },
      { $setOnInsert: { firebaseUid }, $set: update },
      { new: true, upsert: true }
    );

    return res.json({
      message: 'Social login processed',
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Error during socialLogin:', error);
    return res.status(500).json({ message: 'Server error during social login.' });
  }
};