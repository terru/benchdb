/** Mongo Subscriber implementation */
const MQTT = require('async-mqtt');
const mongoose = require('mongoose');
const config = require('../config/config');
const logger = require('../config/logger');
const Subscriber = require('./subscriber');
const Sensor = require('../models/mongo/sensor');

class MongoSubscriber extends Subscriber {
  constructor(props) {
    super();
    this.channel = props.channel;
    this.startTime = 0;
    this.attemps = 10;
  }

  // private methods

  async _onConnect() {
    logger.info('Starting a subscriber with mongo as engine');
    try {
      await this.client.subscribe(this.channel);
    } catch (e) {
      // Do something about it!
      logger.info(e.stack);
      process.exit();
    }
  }

  _onError(e) {
    logger.error('Error on this subscriber:', this.constructor);
    throw e;
  }

  _onExit() {
    logger.info(`Last message received, closing connection...`);
    this.client.end();
    // TODO
    // close mongo connection;
    // finish and show info;
    const endTime = new Date().getTime();
    logger.info(`Elapsed time: ${endTime - this.startTime} ms`);
  }

  async _onMessage(topic, message) {
    // message is Buffer
    // logger.info(`Getting this message: ${message.toString()}`);
    const data = JSON.parse(message);
    // TODO check with try/catch
    const result = await this._mongoTransaction([data], Sensor);
    logger.info(`Message saved in: ${result.time} ms`);
    // since process id starts with 0; limit should be the last id plus one
    const limit = data.id + 1;
    if (limit === config.bench.sendersAmount) {
      this._onExit();
    }
  }

  async _mongoTransaction(data, Model) {
    // Start the transaction.
    const session = await Model.startSession();
    session.startTransaction();
    try {
      const options = { session };

      // Try and perform operation on Model. (Measure it)
      const startTime = new Date().getTime();

      const result = {};

      result.doc = await Model.create(data, options);

      const endTime = new Date().getTime();

      result.time = endTime - startTime;

      // If all succeeded with no errors, commit and end the session.
      await session.commitTransaction();
      session.endSession();
      return result;
    } catch (e) {
      // If any error occured, the whole transaction fails and throws error.
      // Undos changes that may have happened.
      logger.error(e);
      await session.abortTransaction();
      session.endSession();
      this._onError(e);
    }
  }

  async mongooseConnect() {
    try {
      await mongoose.connect('mongodb://mongo1:27017,mongo2:27018,mongo3:27019/iot_data', {
        useNewUrlParser: true,
        useFindAndModify: false, // optional
        useCreateIndex: true,
        replicaSet: 'rs0', // We use this from the entrypoint in the docker-compose file
      });
    } catch (e) {
      if (this.attemps > 0) {
        this.attemps -= 1;
        await setTimeout(this.init.bind(this), 3000);
      } else {
        logger.error('Max connectiona attemps');
        throw e;
      }
    }
  }

  // public methods
  async init() {
    const self = this;
    await this.mongooseConnect();
    logger.info('Connected to MongoDB using a docker service and a replica Set');
    logger.info('Trying to get a MQTT connection...');
    self.client = MQTT.connect(config.mosquitto.host);
    self.client.on('connect', self._onConnect.bind(self));
    self.client.on('message', self._onMessage.bind(self));
    logger.info('Starting to count elapsed time...');
    self.startTime = new Date().getTime();
  }
}

module.exports = MongoSubscriber;
