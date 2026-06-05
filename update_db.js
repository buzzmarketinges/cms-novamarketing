const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '.tmp', 'data.db');

try {
  const db = new Database(dbPath);
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();

  const replacements = [
    { from: /buzzmarketing\.es/gi, to: 'novamarketing.es' },
    { from: /hola@buzzmarketing\.es/gi, to: 'hola@novamarketing.es' },
    { from: /BuzzMarketing/g, to: 'Nova Marketing' },
    { from: /buzzmarketing/g, to: 'Nova Marketing' }
  ];

  console.log("Starting DB search and replace...");

  tables.forEach(table => {
    const tableName = table.name;
    // Skip system tables
    if (tableName.startsWith('sqlite_')) return;

    try {
      // Get columns
      const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
      const textColumns = columns.filter(c => {
        const type = c.type ? c.type.toLowerCase() : '';
        return type.includes('text') || type.includes('varchar') || type.includes('string') || type === ''; // some cols might have no type or be dynamic
      });

      if (textColumns.length === 0) return;

      // Fetch row IDs first to avoid modifying cursor issues
      const idRows = db.prepare(`SELECT id FROM ${tableName}`).all();
      
      idRows.forEach(idRow => {
        const id = idRow.id;
        // Get full row
        const row = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).get(id);
        if (!row) return;

        let rowUpdated = false;
        const updates = {};
        const updateVals = [];

        textColumns.forEach(col => {
          const colName = col.name;
          const value = row[colName];

          if (value && typeof value === 'string') {
            let newValue = value;
            let changed = false;

            replacements.forEach(({ from, to }) => {
              if (newValue.match(from)) {
                newValue = newValue.replace(from, to);
                changed = true;
                rowUpdated = true;
              }
            });

            if (changed) {
              updates[colName] = newValue;
            }
          }
        });

        if (rowUpdated) {
          const setClause = Object.keys(updates).map(c => `${c} = ?`).join(', ');
          const vals = Object.values(updates);
          vals.push(id);
          db.prepare(`UPDATE ${tableName} SET ${setClause} WHERE id = ?`).run(...vals);
          console.log(`Updated ${tableName} row ${id}`);
        }
      });

    } catch (err) {
      console.warn(`Could not process table ${tableName}: ${err.message}`);
    }
  });

  db.close();
  console.log("Database update complete.");
} catch (error) {
  console.error("Error updating database:", error);
}
