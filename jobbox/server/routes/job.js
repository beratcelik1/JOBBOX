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





module.exports = router;
