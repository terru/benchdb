const mongoose = require('mongoose');
const logger = require('./logger');
const Sensor = require('../models/mongo/sensor');
// If on a linux server, use the hostname provided by the docker compose file
// e.g. HOSTNAME = mongo1, mongo2, mongo3

// If on MacOS add the following to your /etc/hosts file.
// 127.0.0.1  mongo1
// 127.0.0.1  mongo2
// 127.0.0.1  mongo3
// And use localhost as the HOSTNAME
async function transaction() {
  // Start the transaction.
  const session = await Sensor.startSession();
  session.startTransaction();
  try {
    const options = { session };

    // Try and perform operation on Model.
    const a = await Sensor.create([{ id: 'ada', datum: 'adada', timestamp: new Date() }], options);

    // If all succeeded with no errors, commit and end the session.
    await session.commitTransaction();
    session.endSession();
    return a;
  } catch (e) {
    // If any error occured, the whole transaction fails and throws error.
    // Undos changes that may have happened.
    await session.abortTransaction();
    session.endSession();
    throw e;
  }
}

mongoose
  .connect('mongodb://mongo1:27017,mongo2:27018,mongo3:27019/iot_data', {
    useNewUrlParser: true,
    useFindAndModify: false, // optional
    useCreateIndex: true,
    replicaSet: 'rs0', // We use this from the entrypoint in the docker-compose file
  })
  .then(() => {
    logger.info('Connected to MongoDB using a docker service and a replica Set');
    transaction().then(() => {
      logger.info('TRANSACTION');
    });
  })
  .catch((e) => {
    logger.error('ERROR');
    logger.error(e);
  });
