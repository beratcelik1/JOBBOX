const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    default: '',
  },
  about: [{
    title: String,
    description: String,
  }],
  experience: [{
    position: String,  // Changed from title
    company: String,
    startDate: Date,
    endDate: Date,
    description: String,
  }],  
  education: [{
    date: String,
    degree: String,
    major: String,
    university: String,
  }],
  skills: [String],
  recommendations: [{
    name: String,
    relationship: String,
    recommendation: String,
  }], 
  jobPostings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
  }] 
});


// hash password before saving
UserSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcryptjs.hash(user.password, 10);
  }
  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
