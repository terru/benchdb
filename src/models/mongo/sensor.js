const mongoose = require('mongoose');

const sensorSchema = mongoose.Schema({
  datum: {
    type: String,
    required: true,
    trim: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  id: {
    type: String,
    required: true,
    trim: true,
  },
});

/**
 * @typedef Sensor
 */
const Sensor = mongoose.model('Sensor', sensorSchema);

module.exports = Sensor;
