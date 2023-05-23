require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const authRoutes = require('./routes/auth');
const multer = require('multer');
const path = require('path');

// Define storage for the images
const storage = multer.diskStorage({
  // Destination to store image     
  destination: 'uploads', 
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    // file.fieldname is name of the field (image), path.extname get the uploaded file extension
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000 // 1000000 Bytes = 1 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) { 
      // upload only png and jpg format
      return cb(new Error('Please upload a Image'))
    }
    cb(undefined, true)
  } 
})

app.post('/upload', upload.single('image'), (req, res, next) => {
  if (!req.file) {
    return next(new Error('File upload failed'));
  }
  // Send the path to the image file
  res.send({ path: '/uploads/' + req.file.filename });
}, (error, req, res, next) => {
  // Error handling middleware
  res.status(400).send({error: error.message});
})


app.use(cors());
app.use(express.json()); // for parsing application/json
app.use('/auth', authRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
