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

// List detail page - shows items for a specific list
router.get('/lists/:id', function(req, res, next) {
  try {
    const list = req.db.getListById(req.params.id);
    if (!list) {
      return res.status(404).send('List not found');
    }
    const items = req.db.getItemsByListId(req.params.id);
    res.render('detail', { title: `${list.name} - Grocery Flow`, list, items });
  } catch (err) {
    next(err);
  }
});

// Add item to a list
router.post('/lists/:id/items', function(req, res, next) {
  try {
    const { name, category, quantity } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).send('Item name is required');
    }
    req.db.addItem(req.params.id, name.trim(), category, parseInt(quantity) || 1);
    res.redirect(`/lists/${req.params.id}`);
  } catch (err) {
    next(err);
  }
});

// Toggle purchased status
router.post('/items/:itemId/toggle', function(req, res, next) {
  try {
    const { listId } = req.body;
    req.db.togglePurchased(req.params.itemId);
    res.redirect(`/lists/${listId}`);
  } catch (err) {
    next(err);
  }
});

// Delete an item
router.post('/items/:itemId/delete', function(req, res, next) {
  try {
    const { listId } = req.body;
    req.db.deleteItem(req.params.itemId);
    res.redirect(`/lists/${listId}`);
  } catch (err) {
    next(err);
  }
});

module.exports = router;