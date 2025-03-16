const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.get('/temperature', (req, res) => {
  res.render('visual-page-1', { title: 'Visualisation des températures' });
});

router.get('/education', (req, res) => {
  res.render('visual-page-2', { title: 'Visualisation de l\'éducation' });
});

router.get('/financement', (req, res) => {
  res.render('visual-page-3', { title: 'Visualisation des financements' });
});

module.exports = router;
