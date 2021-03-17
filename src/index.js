const logger = require('./config/logger');
const SenderFactory = require('./senders/sender.factory');
const MongoSubscriber = require('./subscriber/mongoSubscriber');
const config = require('./config/config');

logger.info('ATTEMPTING TO PERFORM A NEW BENCH...');
const { sendersAmount } = config.bench;
const { channel } = config.mosquitto;
const subscriber = new MongoSubscriber({ channel });

subscriber
  .init()
  .then(() => {
    logger.info('Creating senders...');
    const Factory = new SenderFactory();

    Factory.createSenders(sendersAmount, channel);

    Factory.runSenders();
  })
  .catch((e) => {
    logger.error('Error in mongo conection, please restart....');
    logger.error(e.stack);
    process.exit();
  });

/* TODO LIST
  - Solve situation when starting mongo; maybe a delay in benchdb?
  - Add profiling method to Subscriber -> WIP
    - add Retrieving time, after saving;
    - check _onExit TODO
    - elapsed time should be calculated before saving all the data;
    - profiler could estimate media, avg and retrieval
    - think a way of moving _onExit to abstract class;
    - think a way of moving profiling required methods
  - Add another subscribers kind
  - Check some statisticks to show
  - Add colors to console; generate a file with the output;
*/

/* TODO ENGINES
 - resolve mongo/script chown issue
 - add env variable to define the engine to be used and up
 - check env variable to connect with the db
 - copy env.example
*/
