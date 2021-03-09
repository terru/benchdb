/** Sender factory */
const logger = require('../config/logger');
const Sender = require('./sender');

class SenderFactory {
  constructor(props) {
    this.props = props;
    if (typeof SenderFactory.instance === 'object') {
      return SenderFactory.instance;
    }
    SenderFactory.instance = this;
    return this;
  }

  create(number, channel, topic, innerData) {
    logger.info(`Attempting to create ${number} senders`);
    this.senders = [];
    try {
      const senderProps = {
        channel,
        topic,
        innerData,
      };
      for (let i = 0; i < number; i += 1) {
        this.senders.push(new Sender(senderProps));
      }
      return this.senders;
    } catch (e) {
      logger.error('Error at creating a Sender');
      logger.error(this.instance);
      logger.error(e.stack);
      process.exit();
    }
  }

  run(number) {
    logger.info(`Attempting to run this number: ${number} of senders`);
    try {
      for (let i = 0; i < number; i += 1) {
        this.senders[i].run();
      }
    } catch (e) {
      logger.error('Error at running a Sender');
      logger.error(this.instance);
      logger.error(e.stack);
      process.exit();
    }
  }
}

module.exports = SenderFactory;
