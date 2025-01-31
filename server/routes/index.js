const express = require('express');
const router = express.Router();

router.use('/knowledgebases', require('./knowledgebases'));

module.exports = router;
