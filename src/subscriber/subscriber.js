/** Subscriber facade */
const MQTT = require('async-mqtt');
const config = require('../config/config');
const logger = require('../config/logger');

class Subscriber {
  constructor(props) {
    this.channel = props.channel;
    this.client = MQTT.connect(config.mosquitto.host);
  }
  // prvate methods

  async _MQTTSubscribe() {
    logger.info('Starting a subscriber');
    try {
      await this.client.subscribe(this.channel);
    } catch (e) {
      // Do something about it!
      logger.info(e.stack);
      process.exit();
    }
  }

  _MQTTMessage(topic, message) {
    // message is Buffer
    logger.info(`Getting this message: ${message.toString()}`);
    const data = JSON.parse(message);
    // since process id starts with 0; limit should be the last id plus one
    const limit = data.id + 1;
    if (limit === config.bench.sendersAmount) {
      logger.info(`Last message received, closing connection...`);
      this.client.end();
    }
  }

  // public methods
  init() {
    this.client.on('connect', this._MQTTSubscribe.bind(this));
    this.client.on('message', this._MQTTMessage.bind(this));
  }
}

module.exports = Subscriber;
