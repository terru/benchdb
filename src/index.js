const mongoose = require('mongoose');
const config = require('./config/config');

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  console.log('Connected to MongoDB');
  console.log('This is a new docker file!!');
});
