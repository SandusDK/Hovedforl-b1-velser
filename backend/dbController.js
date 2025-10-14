import pkg from 'pg';
const { Pool } = pkg;

class dbController {
    constructor() {
            // Mock credentials, change to use env with real later.
            this.pool = new Pool({
                user: 'mockuser',
                host: 'localhost',
                database: 'mockdb',
                password: 'mockpassword',
                port: 5432,
            });
    }

    async query(text, params) {
        const client = await this.pool.connect();
        try {
            const res = await client.query(text, params);
            return res;
        } finally {
            client.release();
        }
    }

    // Example method: intentionally vulnerable search, also mock db structure.
    async getImagesMetadata(searchTerm) {
        const sql = `SELECT * FROM images WHERE title LIKE '%${searchTerm}%' OR description LIKE '%${searchTerm}%'`;
        const res = await this.query(sql);
        return res.rows;
    }

    async close() {
        await this.pool.end();
    }
}

export default dbController;
