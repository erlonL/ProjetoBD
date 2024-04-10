import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
}).promise()

async function populateDatabase(){
    try {
        await pool.query(`INSERT INTO Alunos (matricula, cpf, nome, serie) VALUES
        ('2024001', '111.222.333-45', 'Everton Ribeiro', 'F1'),
        ('2024002', '222.333.444-56', 'Gabriel Barbosa', 'F2'),
        ('2024003', '333.444.555-67', 'Bruno Henrique', 'F3'),
        ('2024004', '444.555.666-78', 'Diego Ribas', 'F4'),
        ('2024005', '555.666.777-89', 'Arrascaeta', 'F5'),
        ('2024006', '666.777.888-90', 'Michael', 'F6'),
        ('2024007', '777.888.999-01', 'Pedro', 'F7'),
        ('2024008', '888.999.000-12', 'Gerson', 'F8'),
        ('2024009', '999.000.111-23', 'Filipe Luís', 'F9'),
        ('2024010', '000.111.222-34', 'Hugo Souza', 'M1'),
        ('2024011', '112.222.333-45', 'Rodrigo Caio', 'M2'),
        ('2024012', '223.333.444-56', 'Willian Arão', 'M3');`)
        console.log('Data inserted successfully')
    } catch (error) {
        console.error('Error inserting data: ', error)
    }
} 

async function createTable(){
    try {
        await pool.query(`CREATE TABLE IF NOT EXISTS Alunos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            matricula VARCHAR(191) NOT NULL UNIQUE,
            cpf VARCHAR(191) NOT NULL UNIQUE,
            nome VARCHAR(191) NOT NULL,
            serie ENUM('F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'M1', 'M2', 'M3') NOT NULL,
            created TIMESTAMP NOT NULL DEFAULT NOW()
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`)
        console.log('Table created successfully')
    } catch (error) {
        console.error('Error creating table: ', error)
    } 
}

async function createDatabase(){
    try {
        await pool.execute(`CREATE DATABASE ${process.env.MYSQL_DATABASE}`)
        await pool.query(`USE ${process.env.MYSQL_DATABASE}`)
        await createTable().then(
            populateDatabase().then(
                await pool.commit(),
                await pool.end()                
            )
        )
        console.log('Database created successfully')
    } catch (error) {
        console.error('Error creating database: ', error)
    }
}

createDatabase()



// const readFile = util.promisify(fs.readFile)

// async function runSqlFile(filePath){
//     try {
//         const sql = await readFile(filePath, 'utf8')
//         await pool.query(sql)
//         console.log('Schema created successfully')
//     } catch (error) {
//         console.error('Error executing SQL file: ', error)
//     }
// }
// 
// runSqlFile('schema.sql')