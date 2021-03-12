const logger = require('./config/logger');
const SenderFactory = require('./senders/sender.factory');
const Subscriber = require('./subscriber/subscriber');
const config = require('./config/config');
const mongoose = require('./config/mongoose'); // eslint-disable-line

logger.info('ATTEMPTING TO PERFORM A NEW BENCH...');
const { sendersAmount } = config.bench;
const { channel } = config.mosquitto;
const subscriber = new Subscriber({ channel });
subscriber.init();

const Factory = new SenderFactory();

Factory.createSenders(sendersAmount, channel);

Factory.runSenders();

/* TODO LIST
  - CHECK PM2 or another lib to create 1 process from sensor
    -Generate a barrier inside the factory, create the process, run them, finish;
  - Add profiling method to Subscriber
  - Transform Subscriber in a interface, add MongooseSubscriber
  - Add other subscribers
*/

/* TODO ENGINES
 - add env variable to define the engine to be used and up
 - check env variable to connect with the db
 - resolve mongo/script chown issue
*/
