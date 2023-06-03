const express = require('express');
const bcryptjs = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// const Message = require('../models/Message');
// const Conversation = require('../models/Conversation');
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
//...

// // For Messages ---------------
// // Post a new message and start a new conversation if necessary
// router.post('/message', async (req, res) => {
//   const { senderId, receiverId, content } = req.body;

//   // Find existing conversation
//   let conversation = await Conversation.findOne({
//     members: { $all: [senderId, receiverId] },
//   });

//   // If it doesn't exist, create a new one
//   if (!conversation) {
//     conversation = new Conversation({ members: [senderId, receiverId] });
//     await conversation.save();
//   }

//   // create new message
//   const message = new Message({ senderId, receiverId, content, conversation: conversation._id });

//   // save message and return
//   await message.save();
//   res.status(201).json(message);
// });

// // Get all conversations for a specific user
// router.get('/conversations/:userId', async (req, res) => {
//   const userId = req.params.userId;
//   const conversations = await Conversation.find({ members: userId }).populate('members');
//   res.send(conversations);
// });

// // Get all messages in a specific conversation
// router.get('/messages/:conversationId', async (req, res) => {
//   const conversationId = req.params.conversationId;
//   const messages = await Message.find({ conversation: conversationId }).sort('timestamp');
//   res.send(messages);
// });

// router.get('/messages/:user1Id/:user2Id', async (req, res) => {
//   try {
//     const { user1Id, user2Id } = req.params;
//     const conversation = await Conversation.findOne({
//       members: { $all: [user1Id, user2Id] },
//     });
//     if (!conversation) {
//       return res.json([]); // No conversation exists between these two users, so return an empty array
//     }
//     const messages = await Message.find({ conversation: conversation._id }).sort('timestamp');
//     return res.json(messages);
//   } catch (err) {
//     return res.status(500).json({ error: 'Server error' });
//   }
// });

// // End of Messages ---------------


// get all usernames
router.get('/users', async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

router.get('/jobs', async (req, res) => {
  try {
    const Job = require('../models/Job');
    const jobs = await Job.find({}).populate('postedBy', 'firstname lastname');
    res.json(jobs);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;
