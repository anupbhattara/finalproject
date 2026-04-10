var express = require('express');
var router = express.Router();

// Landing page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Grocery Flow' });
});

// Show create list form
router.get('/lists/new', function(req, res, next) {
  res.render('create', { title: 'Create List - Grocery Flow' });
});

// View all lists
router.get('/lists', function(req, res, next) {
  try {
    const lists = req.db.getAllLists();
    res.render('lists', { title: 'My Lists - Grocery Flow', lists });
  } catch (err) {
    next(err);
  }
});

// Create a new list (form POST)
router.post('/lists', function(req, res, next) {
  try {
    const { name, description } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).send('List name is required');
    }
    req.db.createList(name.trim(), description ? description.trim() : '');
    res.redirect('/lists');
  } catch (err) {
    next(err);
  }
});

// Delete a list
router.post('/lists/:id/delete', function(req, res, next) {
  try {
    req.db.deleteList(req.params.id);
    res.redirect('/lists');
  } catch (err) {
    next(err);
  }
});

module.exports = router;