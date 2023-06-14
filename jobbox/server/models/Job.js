const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  skills: [{ type: String, required: true }],
  location: { type: String, required: true},
  pay: { type: Number, required: true },
  estimatedTime: { type: Number, required: true },
  estimatedTimeUnit: { type: String, required: true },
  category: { type: String, required: true }, // New field for job category
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  hiredApplicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // New field for hired applicant
  rejectedApplicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // New field for rejected applicants

});

const Job = mongoose.model('Job', JobSchema);
module.exports = Job;

