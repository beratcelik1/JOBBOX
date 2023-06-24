const express = require('express');
const bcryptjs = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Token = require('../models/token'); 
const sendEmail = require('../utils/sendEmail'); 
const { verificationEmail } = require('../utils/emailTemplates');
const { passwordResetEmail } = require('../utils/emailTemplates');
const crypto = require("crypto");

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  // check if user already exists
  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // create new user
  user = new User({ firstname, lastname, email, password });

  // save user and return token
  await user.save();
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

  const tokenEmail = await new Token({
    userId: user._id,
    token: crypto.randomBytes(32).toString("hex")
  }).save();

  const url = `https://tranquil-ocean-74659.herokuapp.com/auth/users/${user._id}/verify/${tokenEmail.token}`;

  const emailContent = verificationEmail(url);

  await sendEmail(user.email, "Email Verification - JOBBOX", null, emailContent);

  console.log('Response:', { token, user: { _id: user._id } });
  res.status(201).json({ token, user: { _id: user._id } });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // check if user exists
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).send({ error: 'Invalid login credentials' });
    }

    // check password
    const validPassword = await bcryptjs.compare(password, user.password);

    if (!validPassword) {
        return res.status(400).send({ error: 'Invalid login credentials' });
    }

    // create and return jwt
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    console.log('Response:', { token });
    res.send({ token,  user: { _id: user._id, verified: user.verified } });
});

router.put('/user/me', async (req, res) => {
  // get token from the Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Authorization token missing' });
  }

  try {
    // verify the token and extract the user ID
    const data = jwt.verify(token, process.env.JWT_SECRET);

    // find the user with the extracted ID
    const user = await User.findById(data.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // update user data
    const allowedUpdates = ['about', 'experience', 'education', 'skills', 'recommendations', 'earningTarget', 'spendingTarget'];
    const updates = Object.keys(req.body);
    updates.forEach((update) => {
      if (allowedUpdates.includes(update)) {
        user[update] = req.body[update];
      }
    });    
    await user.save();


    // send updated user data
    res.send(user);
    } catch {
    res.status(401).send({ error: 'Not authorized to access this resource' });
    }
});

router.get('/user/me', async (req, res) => {
  // get token from the Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Authorization token missing' });
  }

  try {
    // verify the token and extract the user ID
    const data = jwt.verify(token, process.env.JWT_SECRET);

    // find the user with the extracted ID
    const user = await User.findById(data.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // send user data
    res.send(user);
  } catch {
    res.status(401).send({ error: 'Not authorized to access this resource' });
  }
});

//...
router.put('/user/me/profilePic', async (req, res) => {
  // get token from the Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Authorization token missing' });
  }

  try {
    // verify the token and extract the user ID
    const data = jwt.verify(token, process.env.JWT_SECRET);

    // find the user with the extracted ID
    const user = await User.findById(data.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // update the user's profile picture
    user.profilePic = req.body.profilePic;
    await user.save();

    // send updated user data
    res.send(user);
  } catch {
    res.status(401).send({ error: 'Not authorized to access this resource' });
  }
});

// update user location
router.put('/user/me/location', async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Authorization token missing' });
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(data.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.location = req.body.location;
    await user.save();
    res.send(user);
  } catch {
    res.status(401).send({ error: 'Not authorized to access this resource' });
  }
});

// get user location
router.get('/user/me/location', async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Authorization token missing' });
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(data.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.send({ location: user.location });
  } catch {
    res.status(401).send({ error: 'Not authorized to access this resource' });
  }
});

// get all usernames
router.get('/users', async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

// notifications
router.post('/notifications', async (req, res) => {
  const { to, from, action, conversationId, jobId } = req.body;

  // Create new notification
  const notification = new Notification({ to, from, action, conversationId, jobId });

  // Save notification and return it
  await notification.save();
  res.status(201).json(notification);
});

// Fetch all notifications for a specific user
router.get('/notifications/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({ to: req.params.userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Mark a specific notification as read
router.put('/notifications/:notificationId', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.notificationId, { read: true }, { new: true });
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.json(notification);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Delete a specific notification
router.delete('/notifications/:notificationId', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.notificationId);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.json({ message: 'Notification deleted successfully' });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// verification route
router.get("/users/:userId/verify/:token", async(req,res) => {
  try{
    const user = await User.findOne({_id: req.params.userId});
    if (!user) return res.status(400).send({message: "Invalid user + link"});

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token
    });

    if(!token) return res.status(400).send({message: "invalid link"});

    await User.updateOne({_id: user._id}, { verified: true });
    await Token.deleteOne({ _id: token._id });

    res.status(200).send({ message: "Email verified successfully"});
  } catch (error) {
    console.error(error);
    res.status(500).send({message: "server error"});
  }
});

router.put('/user/me/change-password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  console.log(req.body);
  // get token from the Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log(token)
  if (!token) {
    return res.status(401).json({ error: 'Authorization token missing' });
  }
  
  try {
    // verify the token and extract the user ID
    const data = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Extracted User ID:", data.userId);
    // find the user with the extracted ID
    const user = await User.findById(data.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // check if the current password matches
    const validPassword = await bcryptjs.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid current password' });
    }
    
    // update the password with the new one
    user.password = newPassword;
    
    // save the updated user
    await user.save();
    
    // send a response
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error in change password route:', error);
    res.status(500).send({ error: 'An error occurred while trying to change the password' });
  }
});

router.post('/forgotPassword', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const code = crypto.randomBytes(3).toString('hex');

  await Token.deleteOne({ userId: user._id });

  const passwordResetToken = new Token({
    userId: user._id,
    token: code,
  });

  await passwordResetToken.save();

  const emailContent = passwordResetEmail(code);

  await sendEmail(user.email, "Password Reset Code - JOBBOX", null, emailContent);

  res.status(200).json({ message: 'Password reset code sent to email' });
});

router.post('/resetPassword', async (req, res) => {
  const { email, code, newPassword } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const passwordResetToken = await Token.findOne({ userId: user._id, token: code });

  if (!passwordResetToken) {
    return res.status(400).json({ message: 'Invalid or expired password reset code' });
  }

  user.password = newPassword;
  await user.save();

  await Token.findByIdAndDelete(passwordResetToken._id);

  res.status(200).json({ message: 'Password updated successfully' });
});


// delete a user account
router.delete('/user/me', async (req, res) => {
  // get token from the Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Authorization token missing' });
  }

  try {
    // verify the token and extract the user ID
    const data = jwt.verify(token, process.env.JWT_SECRET);

    // Log the user ID that is being extracted from the JWT
    console.log("Extracted User ID:", data.userId);

    // delete the user with the extracted ID
    const user = await User.findByIdAndDelete(data.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await Token.deleteMany({ userId: user._id });

    // send a response
    res.json({ message: 'User account deleted successfully' });
  } catch (error) {
    console.error('Error in delete account route:', error);
    res.status(500).send({ error: 'An error occurred while trying to delete the account' });
  }
  
});



module.exports = router;
