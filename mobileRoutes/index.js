const express = require('express');
const mobilecustomerRouting = require('../mobileRoutes/customerRouting');
const router = express.Router();


//mobile routes
router.use('/mobilecustomer', mobilecustomerRouting);
module.exports = router;
