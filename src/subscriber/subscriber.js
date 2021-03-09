/** Subscriber facade */
const MQTT = require('async-mqtt');
const config = require('../config/config');
const logger = require('../config/logger');

class Subscriber {
  constructor(props) {
    this.channel = props.channel;
    this.client = MQTT.connect(config.mosquitto.host);
    setTimeout(() => {
      logger.info('TIMEOUT: Disconecting from MQTT host...');
      this.client.end();
    }, 15000);
  }

  init() {
    this.client.on('connect', this.MQTTSubscribe.bind(this));
    this.client.on('message', function (topic, message) {
      // message is Buffer
      logger.info(`GETTING this message: ${message.toString()}`);
    });
  }

  async MQTTSubscribe() {
    logger.info('Starting a subscriber');
    try {
      await this.client.subscribe(this.channel);
    } catch (e) {
      // Do something about it!
      logger.info(e.stack);
      process.exit();
    }
  }
}

module.exports = Subscriber;
