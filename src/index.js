const logger = require('./config/logger');
const SenderFactory = require('./senders/sender.factory');
const Subscriber = require('./subscriber/subscriber');

/* mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB using a docker service!');
}); */

logger.info('ATTEMPTING TO PERFORM A NEW BENCH...');
const subscriber = new Subscriber({ channel: 'wow/so/cool' });
subscriber.init();

const Factory = new SenderFactory();
Factory.create(4, 'wow/so/cool', 'topic', 'GOOD MESSAGE FROM PROCESS');

Factory.run(4);

/* TODO LIST
  - ADD lodash to replace native for
  - GET channel from configs + remove topic + RANDOMIZE MESSAGE for sensors
  - GET sensors from config.envs
  - Replace timeout on suscriber by get the last message from the procedures
    -if (pn === n ) send "last" => if "message" == 'last' => disconnect();
  - CHECK PM2 or another lib to create 1 process from sensor
    -Generate a barrier inside the factory, create the process, run them, finish;
  - Transform Subscriber in a interface, add MongooseSubscriber
  - Add profiling method to Subscriber
  - Add other subscribers
*/
