import Database from 'better-sqlite3';

const db = new Database('.tmp/data.db');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();

for (const t of tables) {
    try {
        const columns = db.prepare(`PRAGMA table_info(${t.name})`).all();
        for (const col of columns) {
            const query = `SELECT * FROM ${t.name} WHERE "${col.name}" LIKE ?`;
            const hits = db.prepare(query).all('%novamarketing.es%');
            if (hits.length > 0) {
              hits.forEach(row => {
                const val = row[col.name];
                if (typeof val === 'string' && val.includes('www.')) {
                  console.log(`\n--- WWW MATCH in ${t.name} | COLUMN: ${col.name} ---`);
                  console.log(val);
                }
              });
            }
        }
    } catch (e) {}
}
console.log("Scan complete.");
