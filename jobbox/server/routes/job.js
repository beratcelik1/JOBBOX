const express = require('express');
const Job = require('../models/Job');
const User = require('../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');
// Post a job
router.post('/', async (req, res) => {
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

    const { title, description, skills, location, pay, estimatedTime, estimatedTimeUnit, category } = req.body;
    const job = new Job({ title, description, skills, location, pay, estimatedTime, estimatedTimeUnit, category, postedBy: user._id });
    
    // save job
    await job.save();

    // add job id to user's job postings
    user.jobPostings.push(job._id);
    await user.save();

    res.status(201).send(job);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get jobs by title
router.get('/search', async (req, res) => {
  const search = req.query.search;
  try {
    const jobs = await Job.find({ title: new RegExp(search, 'i') });
    res.send(jobs);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get all jobs
router.get('/', async (req, res) => {
  try {
      const { category, skills, location, pay } = req.query;

      let query = {};

      if(category) {
          query.category = category;
      }
      if(skills) {
          query.skills = new RegExp(skills, 'i'); 
      }
      if(location) {
          query.location = new RegExp(location, 'i'); 
      }
      if(pay) {
          query.pay = { $gte: pay }; // returns jobs with pay greater than or equal to the pay query
      }

      const jobs = await Job.find(query);
      res.send(jobs);
  } catch (error) {
      res.status(500).send(error);
  }
});


router.get('/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const jobs = await Job.find({ postedBy: user._id });
    res.send(jobs);
  } catch (error) {
    res.status(500).send(error);
  }
});


module.exports = router;
