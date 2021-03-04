const mongoose = require('mongoose');
const MQTT = require('async-mqtt');
const config = require('./config/config');

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  console.log('Connected to MongoDB using a docker!');
});

const client = MQTT.connect(config.mosquitto.host);
console.log("Using this config", config.mosquitto.host);

// When passing async functions as event listeners, make sure to have a try catch block

const doStuff = async () => {
  console.log('Starting');
  try {
    await client.publish('wow/so/cool', 'It works!');
    // This line doesn't run until the server responds to the publish
    await client.end();
    // This line doesn't run until the client has disconnected without error
    console.log('Done');
  } catch (e) {
    // Do something about it!
    console.log(e.stack);
    process.exit();
  }
};

client.on('connect', doStuff);
