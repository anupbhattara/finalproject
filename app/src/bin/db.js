const Database = require('better-sqlite3');

const createListsTableSQL = `
  CREATE TABLE IF NOT EXISTS lists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`;

const createItemsTableSQL = `
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    list_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    category TEXT DEFAULT 'Other',
    quantity INTEGER DEFAULT 1,
    purchased INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE
  )`;

function createDatabaseManager(dbPath) {
  const database = new Database(dbPath);
  console.log('Database manager created for:', dbPath);
  database.pragma('foreign_keys = ON');
  database.exec(createListsTableSQL);
  database.exec(createItemsTableSQL);

  function ensureConnected() {
    if (!database.open) {
      throw new Error('Database connection is not open');
    }
  }

  return {
    dbHelpers: {

      clearDatabase: () => {
        if (process.env.NODE_ENV === 'test') {
          ensureConnected();
          database.prepare('DELETE FROM items').run();
          database.prepare('DELETE FROM lists').run();
        } else {
          console.warn('clearDatabase called outside of test environment. FIXME!');
        }
      },

      seedTestData: () => {
        if (process.env.NODE_ENV === 'test') {
          ensureConnected();
          console.log('Seeding test data into database');
        } else {
          console.warn('seedTestData called outside of test environment. FIXME!');
        }
      },

      // Get all grocery lists ordered by most recently created
      getAllLists: () => {
        ensureConnected();
        return database.prepare(
          'SELECT id, name, description, created_at FROM lists ORDER BY created_at DESC'
        ).all();
      },

      // Create a new grocery list and return the inserted row id
      createList: (name, description) => {
        ensureConnected();
        const stmt = database.prepare(
          'INSERT INTO lists (name, description) VALUES (?, ?)'
        );
        const result = stmt.run(name, description || null);
        return result.lastInsertRowid;
      },

      // Delete a list by id (CASCADE removes its items too)
      deleteList: (id) => {
        ensureConnected();
        database.prepare('DELETE FROM lists WHERE id = ?').run(id);
      },

    }
  };
}

module.exports = {
  createDatabaseManager,
};