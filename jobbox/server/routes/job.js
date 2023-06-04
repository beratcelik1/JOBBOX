const express = require('express');
const Job = require('../models/Job');
const User = require('../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware for token verification and user fetching
const authenticate = async (req, res, next) => {
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
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Not authorized to access this resource' });
    }
};

// Post a job
router.post('/', authenticate, async (req, res) => {
    try {
        const { title, description, skills, location, pay, estimatedTime, estimatedTimeUnit, category } = req.body;

        // TODO: Add input validation based on your requirements
        if (!title || !description) {
            return res.status(400).json({ error: 'Missing necessary fields' });
        }

        const job = new Job({
            title,
            description,
            skills,
            location,
            pay,
            estimatedTime,
            estimatedTimeUnit,
            category,
            postedBy: req.user._id,
        });

        await job.save();
        req.user.jobPostings.push(job._id);
        await req.user.save();

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

        if (category) {
            query.category = category;
        }

        if (skills) {
            query.skills = new RegExp(skills, 'i');
        }

        if (location) {
            query.location = new RegExp(location, 'i');
        }

        if (pay) {
            query.pay = { $gte: pay };
        }

        const jobs = await Job.find(query).populate('postedBy', 'firstname lastname');
        res.send(jobs);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Edit a job
router.patch('/:jobId', authenticate, async (req, res) => {
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
      
      // save the updated job
      await job.save();

      res.send(job);

  } catch (error) {
      res.status(400).send(error);
  }
}); 

// Delete a job
router.delete('/:id', authenticate, async (req, res) => { 
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

// user data 
router.get('/user/:userId', async (req, res) => {
  try {
      const user = await User.findById(req.params.userId);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      const jobs = await Job.find({ postedBy: user._id, rejectedApplicants: { $ne: user._id }}).populate('postedBy', 'firstname lastname');
      res.send(jobs);
  } catch (error) {
      res.status(500).send(error);
  }
});

// Apply to a job
router.post('/apply/:jobId', async (req, res) => {
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

      // find the job
      const job = await Job.findById(req.params.jobId);
      if (!job) {
          return res.status(404).json({ error: 'Job not found' });
      }

      // check if user has already applied
      if (job.applicants.includes(user._id)) {
          return res.status(400).json({ error: 'User has already applied for this job' });
      }

      // add user to the list of applicants
      job.applicants.push(user._id);

      // save the job
      await job.save();

      res.status(200).send(job);
  } catch (error) {
      res.status(400).send(error);
  }
}); 
// Get all applicants for a job
router.get('/applicants/:jobId', authenticate, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId).populate('applicants', 'firstname lastname profilePic bio rating');
    console.log(job);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.send(job.applicants);
  } catch (error) {
    res.status(500).send(error);
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

// Reject an applicant
router.post('/reject/:jobId/:userId', async (req, res) => {
  const { jobId, userId } = req.params;

  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).send({ error: 'Authorization token missing' });
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(data.userId);

    if (!currentUser) {
      return res.status(404).send({ error: 'User not found' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).send({ error: 'Job not found' });
    }

    if (!job.postedBy.equals(currentUser._id)) {
      return res.status(403).send({ error: 'You are not authorized to reject applicants for this job' });
    }

    if (!job.applicants.includes(userId)) {
      return res.status(400).send({ error: 'User has not applied for this job' });
    }

    job.rejectedApplicants.push(userId);
    job.applicants = job.applicants.filter(id => id.toString() !== userId);

    await job.save();

    res.send(job);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Server error" });
  }
});

// Hire an applicant
router.post('/hire/:jobId/:userId', async (req, res) => {
  const { jobId, userId } = req.params;
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
      return res.status(401).send({ error: 'Authorization token missing' });
  }
  try {
      const data = jwt.verify(token, process.env.JWT_SECRET);
      const currentUser = await User.findById(data.userId);
      if (!currentUser) {
          return res.status(404).send({ error: 'User not found' });
      }
      const job = await Job.findById(jobId);
      if (!job) {
          return res.status(404).send({ error: 'Job not found' });
      }
      if (!job.postedBy.equals(currentUser._id)) {
          return res.status(403).send({ error: 'You are not authorized to hire applicants for this job' });
      }
      if (job.hiredApplicant) {
          return res.status(400).send({ error: 'An applicant has already been hired for this job' });
      }
      if (!job.applicants.includes(userId)) {
          return res.status(400).send({ error: 'User has not applied for this job' });
      }
      job.hiredApplicant = userId;
      job.applicants = [];
      await job.save();
      res.send(job);
  } catch (err) {
      console.error(err);
      res.status(500).send({ error: "Server error" });
  }
});

module.exports = router;
