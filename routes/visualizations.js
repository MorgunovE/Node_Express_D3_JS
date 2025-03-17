const express = require('express');
const router = express.Router();
const path = require('path');

// GET temperature visualization page
router.get('/temp', function(req, res, next) {
  res.render('temp');
});

// GET kickstarter visualization page
router.get('/kickstarter', function(req, res, next) {
  res.render('kickstarter');
});

module.exports = router;
