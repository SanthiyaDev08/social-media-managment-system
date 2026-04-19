const db = require('./backend/config/db');

async function updateDb() {
    try {
        console.log("Updating database schema...");
        await db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS role ENUM('user', 'admin') DEFAULT 'user'");
        await db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE");
        
        // Let's make the first user an admin just so we have one to test with
        await db.query("UPDATE users SET role = 'admin' ORDER BY id ASC LIMIT 1");
        
        console.log("Database updated successfully.");
    } catch (error) {
        console.error("Failed to update database:", error);
    } finally {
        process.exit();
    }
}

updateDb();
