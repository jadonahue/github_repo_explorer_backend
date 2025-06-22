// import { Pool } from 'pg';
// import dotenv from 'dotenv';
// dotenv.config();

// const pool = new Pool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME,
//     port: 5432,
// });

// export default pool;

import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Heroku requires SSL
    },
});

export default pool;
