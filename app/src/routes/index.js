var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Grocery Flow' });
});

router.get('/lists/new', function(req, res, next) {
  res.render('create', { title: 'Create List - Grocery Flow' });
});

module.exports = router;