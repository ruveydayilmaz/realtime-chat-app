// PACKAGES
const mongoose = require('mongoose');

// CONFIG
const config = require('./config');

const environment = config.environment || 'development';

mongoose
  .connect(config[environment].database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DATABASE ➤ MongoDB connected')
  })
  .catch((err) => console.log(err.message))

mongoose.connection.on('connected', () => {
  console.log('DATABASE ➤ Mongoose connected to MongoDB')
})

mongoose.connection.on('error', (err) => {
  console.log(err.message)
})

mongoose.connection.on('disconnected', () => {
  console.log('DATABASE ➤ Mongoose disconnected')
})

// shut down running connection if the server is terminated
process.on('SIGINT', async () => {
  await mongoose.connection.close()
  process.exit(0)
})
