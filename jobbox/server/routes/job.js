const express = require('express');
const Job = require('../models/Job');
const User = require('../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth'); // Make sure to have this middleware to authenticate users


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
      query.pay = { $gte: Number(pay) }; // returns jobs with pay greater than or equal to the pay query
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

router.put('/:jobId', authenticate, async (req, res) => {
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
    
    job.title = title;
    job.description = description;
    job.skills = skills;
    job.location = location;
    job.pay = pay;
    job.estimatedTime = estimatedTime;
    job.estimatedTimeUnit = estimatedTimeUnit;
    job.category = category;
    
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
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    const job = await Job.findById(req.params.id);
console.log("Job found:", job);

if (!job) {
  console.log('Job not found');
  return res.status(404).json({ error: 'Job not found' });
}

console.log(job instanceof Job); // Ensure that job is an instance of your Job model

if (!job.postedBy.equals(user._id)) {
  console.log('User is not authorized to delete this job');
  return res.status(403).json({ error: 'You are not authorized to delete this job' });
}

// If the job is an instance of the Job model, then it should have the .remove method
// If it doesn't, you could try deleting by id directly on the model
try {
  await Job.findByIdAndRemove(job._id);
} catch (error) {
  console.error("Error while removing job:", error);
  return res.status(500).send("Error while removing job.");
}

res.json({ message: 'Job deleted' });


  } catch (error) {
    console.error(error);
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

// Get a specific job by id
router.get('/:jobId', async (req, res) => {
  try {
      const job = await Job.findById(req.params.jobId).populate('postedBy', 'firstname lastname');
      if (!job) {
          return res.status(404).json({ error: 'Job not found' });
      }
      res.send(job);
  } catch (error) {
      res.status(500).send(error);
  }
});

// handle apply job
// router.post('/apply', async (req, res) => {
//   const { jobId, userId } = req.body;

//   try {
//     const job = await Job.findByIdAndUpdate(
//       jobId,
//       { $addToSet: { applicants: userId } },
//       { new: true }  // Returns the updated document
//     );

//     if (!job) {
//       return res.status(404).send({ message: "Job not found" });
//     }

//     // Add job application to the user document
//     const user = await User.findByIdAndUpdate(
//       userId,
//       { $addToSet: { jobApplications: { job: jobId, status: 'applied' } } },
//       { new: true }  // Returns the updated document
//     );

//     if (!user) {
//       return res.status(404).send({ message: "User not found" });
//     }

//     console.log(job);
//     res.send(job);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ message: "Server error" });
//   }
// });


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

    const applicant = await User.findById(userId);
    const application = applicant.jobApplications.find(app => app.job.equals(jobId));
    application.status = 'rejected';
    await applicant.save();

    await job.save();
    res.send(job);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Server error" });
  }
});

// Hire an applicant
router.post('/hire/:jobId/:userId', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    const user = await User.findById(req.params.userId);
    if (!job || !user) {
      return res.status(404).json({ error: 'Job or user not found' });
    }
    if (job.hiredApplicant) {
      return res.status(400).json({ error: 'An applicant has already been hired for this job' });
    }
    job.hiredApplicant = user._id;
    user.jobPostings.push(job._id); // Update the user's jobPostings array
    await job.save();
    await user.save();
    res.status(200).json({ message: 'Applicant hired successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reject an applicant
router.post('/reject/:jobId/:userId', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    const user = await User.findById(req.params.userId);
    if (!job || !user) {
      return res.status(404).json({ error: 'Job or user not found' });
    }
    job.rejectedApplicants.push(user._id);
    await job.save();
    res.status(200).json({ message: 'Applicant rejected successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

 
router.get('/user/:userId/jobs', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const jobs = await Job.find({ 
      _id: { $in: user.jobApplications.filter(app => app.status !== 'rejected').map(app => app.job) }
    }).populate('postedBy', 'firstname lastname');
    res.send(jobs);
  } catch (error) {
    res.status(500).send(error);
  }
});



module.exports = router;
