const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
    console.log("Connecting to database at:", process.env.MYSQLHOST);
    try {
        const connection = await mysql.createConnection({
            host: process.env.MYSQLHOST,
            user: process.env.MYSQLUSER,
            password: process.env.MYSQLPASSWORD,
            database: process.env.MYSQLDATABASE,
            port: process.env.MYSQLPORT || 3306,
            multipleStatements: true // This allows running the entire schema.sql file at once
        });

        console.log("Successfully connected to the database. Reading schema.sql...");
        
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log("Executing SQL commands...");
        await connection.query(schema);
        
        console.log("✅ SUCCESS! All tables have been successfully created in your Railway database!");

        await connection.end();
    } catch (error) {
        console.error("❌ Failed to setup database. Please check your .env credentials:", error);
    }
}

setupDatabase();
