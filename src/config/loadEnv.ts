// Load dotenv file path correctly to server.ts
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
    path: path.resolve(__dirname, '../../.env'),
});
