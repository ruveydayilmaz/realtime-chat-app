require('dotenv').config();

// PACKAGES
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const {I18n} = require('i18n');

require('./config/mongoose');
require('./config/redis');

const ApiRoutes = require('./routes');
const socket = require('./utils/socket');
const config = require('./config/config');

const app = express();
const server = http.createServer(app);

const i18n = new I18n({
  locales: ['en'],
  directory: path.join(__dirname, 'locales'),
  defaultLocale: 'en'
});

// Custom middleware to add `t` function to `req`
app.use((req, res, next) => {
  req.t = (key, options) => i18n.__({ phrase: key, locale: req.locale }, options);
  next();
});

app.use(i18n.init);

socket(server);

// middlewares
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// to serve images inside public folder
app.use(express.static("public"));
app.use("/images", express.static("images"));

// routes
app.use('/api', ApiRoutes);

const PORT = config.port || 3000;

server.listen(PORT, () => {
  console.log(`SERVER ➤ Server running on port ${PORT}`);
});
