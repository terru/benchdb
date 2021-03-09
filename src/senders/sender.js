const MQTT = require('async-mqtt');
const config = require('../config/config');
const logger = require('../config/logger');

class Sender {
  constructor(props) {
    this.innerData = props.innerData;
    this.channel = props.channel;
    this.topic = props.topic;
    this.client = MQTT.connect(config.mosquitto.host);
  }

  async run() {
    try {
      logger.info('Running sender...');
      await this.client.publish(this.channel, this.innerData);
      // This line doesn't run until the server responds to the publish
      await this.client.end();
    } catch (e) {
      // Do something about it!
      logger.error(e.stack);
      process.exit();
    }
  }
}

module.exports = Sender;
