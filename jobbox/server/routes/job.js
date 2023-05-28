const express = require('express');
const Job = require('../models/Job');
const User = require('../models/User');
const router = express.Router();

// Post a job
router.post('/', async (req, res) => {
  const job = new Job(req.body);
  try {
    await job.save();
    res.status(201).send(job);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({});
    res.send(jobs);
  } catch (error) {
    res.status(500).send(error);
  }
}); 

// Get jobs by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.params.userId });
    res.send(jobs);
  } catch (error) {
    res.status(500).send(error);
  }
});


module.exports = router;
