require('dotenv').config({ path: '../mongo.env' });
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const postsRoute = require('./routes/posts');
const mongoose = require('mongoose');

// DATABASE CONNECTION STRING

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, 
    socketTimeoutMS: 45000,
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

app.use(bodyParser.json());
app.use("/images", express.static(path.join("server/images")))

// SETTING CORS CONFIGURATION

app.use((req,res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    
    next();
});


app.use('/posts', postsRoute)

module.exports = app