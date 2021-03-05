const MQTT = require('async-mqtt');
const config = require('../config/config');
const logger = require('../config/logger');

const client = MQTT.connect(config.mosquitto.host);

// When passing async functions as event listeners, make sure to have a try catch block

const doStuff = async () => {
  logger.info('Starting senders...');
  try {
    await client.publish('wow/so/cool', 'SENDING MY INFORMATION....');
    // This line doesn't run until the server responds to the publish
    await client.end();
    // This line doesn't run until the client has disconnected without error
    logger.info('Done');
  } catch (e) {
    // Do something about it!
    logger.error(e.stack);
    process.exit();
  }
};

client.on('connect', doStuff);
