const MQTT = require('async-mqtt');
const config = require('../config/config');
const logger = require('../config/logger');

class Sender {
  constructor(props) {
    this.channel = props.channel;
    this.id = props.id;
    this.client = MQTT.connect(config.mosquitto.host);
  }

  async run() {
    try {
      logger.info('Running sender...');
      const sentData = {
        id: this.id,
        datum: Math.random(0, 1).toString(),
        timestamp: Date.now(),
      };
      await this.client.publish(this.channel, JSON.stringify(sentData));
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
