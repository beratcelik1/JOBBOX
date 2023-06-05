const express = require('express');
const bcryptjs = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// const Notifi// cation = require('../models/Notification');
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
  console.log('Response:', { token });
  res.status(201).json({ token });
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
    res.send({ token });
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

module.exports = router;
