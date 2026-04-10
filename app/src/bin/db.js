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
        ensureConnected();
        database.prepare('DELETE FROM items').run();
        database.prepare('DELETE FROM lists').run();
      },

      seedTestData: () => {
        console.log('seedTestData called');
      },

      getAllLists: () => {
        ensureConnected();
        return database.prepare(
          'SELECT id, name, description, created_at FROM lists ORDER BY created_at DESC'
        ).all();
      },

      createList: (name, description) => {
        ensureConnected();
        const stmt = database.prepare(
          'INSERT INTO lists (name, description) VALUES (?, ?)'
        );
        const result = stmt.run(name, description || null);
        return result.lastInsertRowid;
      },

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