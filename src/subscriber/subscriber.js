/** Subscriber facade */
const MQTT = require('async-mqtt');
const config = require('../config/config');
const logger = require('../config/logger');

const client = MQTT.connect(config.mosquitto.host);

// When passing async functions as event listeners, make sure to have a try catch block

const MQTTSubscribe = async () => {
  logger.info('Starting');
  try {
    await client.subscribe('wow/so/cool');
  } catch (e) {
    // Do something about it!
    logger.info(e.stack);
    process.exit();
  }
};

client.on('connect', MQTTSubscribe);

client.on('message', function (topic, message) {
  // message is Buffer
  logger.info(`GETTING this message: ${message.toString()}`);
  client.end();
});
