import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

// TODO: Use the env variables
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'escola'
}).promise()

console.log('pool created.')

export default pool;