/** Sender factory is a Singleton to build several senders at the same time */
const _ = require('lodash');
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

  createSenders(number, channel) {
    logger.info(`Attempting to create ${number} senders`);
    this.senders = [];
    try {
      const senderProps = {
        channel,
      };
      for (let i = 0; i < number; i += 1) {
        senderProps.id = i;
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

  runSenders() {
    logger.info(`Attempting to run the senders`);
    try {
      _.each(this.senders, (sender) => {
        sender.run();
      });
    } catch (e) {
      logger.error('Error at running a Sender');
      logger.error(this.instance);
      logger.error(e.stack);
      process.exit();
    }
  }
}

module.exports = SenderFactory;
