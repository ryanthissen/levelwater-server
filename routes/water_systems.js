const express = require('express');
const authorize = require('./authorize');
const postWaterSystem = require('./waterSys_functions/postWaterSystem');

const router = express.Router();

router.post('/water_systems', authorize, postWaterSystem);

module.exports = router;
