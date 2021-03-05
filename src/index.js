const mongoose = require('mongoose');
const config = require('./config/config');
const logger = require('./config/logger');
const subscriber = require('./subscriber/subscriber');
const sender = require('./senders/sender.factory');

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB using a docker service!');
});
