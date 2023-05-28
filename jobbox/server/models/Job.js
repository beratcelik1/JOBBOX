const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  skills: { type: String, required: true },
  location: { type: String, required: true },
  pay: { type: String, required: true },
  estimatedTime: { type: String, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Job = mongoose.model('Job', JobSchema);

module.exports = Job;
