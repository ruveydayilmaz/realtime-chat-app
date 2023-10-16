const express = require('express');
const router = express.Router();

const config = require('../config/config');
const {errorHandler} = require('../middlewares/errorHandler');

// CURRENT API VERSION
const version = config.apiVersion;
const routes = require(`./${version}`);

router.get('/status', (req, res) => { res.send({status: 'OK'}) }) // api status

router.use(`/${version}`, routes);
routes.use(errorHandler);

module.exports = router;