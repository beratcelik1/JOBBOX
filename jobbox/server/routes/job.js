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

// Handle delete job
router.delete('/:id', async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Authorization token missing' });
  }

  try {
    // verify the token and extract the user ID
  const token = req.headers.authorization.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  let data;
  try {
    data = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  // find the job with the extracted ID
  const job = await Job.findById(req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  if (job.postedBy.toString() !== data.userId) {
    return res.status(401).json({ error: 'Not authorized to delete this job' });
  }

  console.log('Deleting job:', job);

  await Job.deleteOne({ _id: job._id });
  res.send(job);
  } catch (error) {
    console.log(error);
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

    const jobs = await Job.find(query).populate('postedBy', 'firstname lastname');
    res.send(jobs);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a user's jobs
router.get('/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const jobs = await Job.find({ postedBy: user._id }).populate('postedBy', 'firstname lastname');
    res.send(jobs);
  } catch (error) {
    res.status(500).send(error);
  }
});



// Edit a job
router.patch('/:jobId', async (req, res) => {
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

    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

      if (job.postedBy.toString() !== user._id.toString()) {
          return res.status(401).json({ error: 'User not authorized to edit this job' });
      }

      const { title, description, skills, location, pay, estimatedTime, estimatedTimeUnit, category } = req.body;

      if (title) job.title = title;
      if (description) job.description = description;
      if (skills) job.skills = skills;
      if (location) job.location = location;
      if (pay) job.pay = pay;
      if (estimatedTime) job.estimatedTime = estimatedTime;
      if (estimatedTimeUnit) job.estimatedTimeUnit = estimatedTimeUnit;
      if (category) job.category = category;

      // apply the updates to the job
      Object.assign(job, req.body);

      // save the updated job
      await job.save();

      res.send(job);

  } catch (error) {
      res.status(400).send(error);
  }
}); 

// Delete a job
router.delete('/:id', async (req, res) => {
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

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (!job.postedBy.equals(user._id)) {
      return res.status(403).json({ error: 'You are not authorized to delete this job' });
    }

    await job.remove();
    res.json({ message: 'Job deleted' });

  } catch (error) {
    res.status(400).send(error);
  }
});


router.get('/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const jobs = await Job.find({ postedBy: user._id }).populate('postedBy', 'firstname lastname');
    res.send(jobs);
  } catch (error) {
    res.status(500).send(error);
  }
}); 

// Delete a job
router.delete('/:id', async (req, res) => {
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

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if the job was posted by the logged in user
    if (job.postedBy.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'You can only delete your own jobs' });
    }

    // delete job
    await job.remove();

    // Remove job id from user's job postings
    user.jobPostings = user.jobPostings.filter((jobId) => jobId.toString() !== job._id.toString());
    await user.save();

    res.status(200).send({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(400).send(error);
  }
});


// handle apply job
router.post('/apply', async (req, res) => {
  const { jobId, userId } = req.body;

  try {
    const job = await Job.findByIdAndUpdate(
      jobId,
      { $addToSet: { applicants: userId } },
      { new: true }  // Returns the updated document
    );

    console.log(job);

    if (!job) {
      return res.status(404).send({ message: "Job not found" });
    }

    res.send(job);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});

// handle get applicants
router.get('/applicants/:jobId', async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await Job.findById(jobId).populate('applicants');
    if (!job) {
      return res.status(404).send({ message: "Job not found" });
    }

    res.send(job.applicants);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});

module.exports = router;
