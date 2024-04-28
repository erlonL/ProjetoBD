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
        const [alunosLength] = await pool.query(`SELECT COUNT(*) as total FROM Alunos`)
        if(alunosLength[0].total > 0){
            console.log('Data already inserted')
            return
        }
        await pool.query(`INSERT INTO Alunos (cpf, nome, serie) VALUES
        ('111.222.333-45', 'Everton Ribeiro', 'F1'),
        ('222.333.444-56', 'Gabriel Barbosa', 'F2'),
        ('333.444.555-67', 'Bruno Henrique', 'F3'),
        ('444.555.666-78', 'Diego Ribas', 'F4'),
        ('555.666.777-89', 'Arrascaeta', 'F5'),
        ('666.777.888-90', 'Michael', 'F6'),
        ('777.888.999-01', 'Pedro', 'F7'),
        ('888.999.000-12', 'Gerson', 'F8'),
        ('999.000.111-23', 'Filipe Luís', 'F9'),
        ('000.111.222-34', 'Hugo Souza', 'M1'),
        ('112.222.333-45', 'Rodrigo Caio', 'M2'),
        ('223.333.444-56', 'Willian Arão', 'M3');`)
        console.log('Alunos Data inserted successfully')

        await pool.query(`INSERT INTO ProfileImages (matricula, url) VALUES
        ('202401', 'https://a.espncdn.com/i/teamlogos/soccer/500/819.png'),
        ('202402', 'https://a.espncdn.com/i/teamlogos/soccer/500/819.png'),
        ('202403', 'https://a.espncdn.com/i/teamlogos/soccer/500/819.png'),
        ('202404', 'https://a.espncdn.com/i/teamlogos/soccer/500/819.png'),
        ('202405', 'https://a.espncdn.com/i/teamlogos/soccer/500/819.png'),
        ('202406', 'https://a.espncdn.com/i/teamlogos/soccer/500/819.png'),
        ('202407', 'https://a.espncdn.com/i/teamlogos/soccer/500/819.png'),
        ('202408', 'https://a.espncdn.com/i/teamlogos/soccer/500/819.png'),
        ('202409', 'https://a.espncdn.com/i/teamlogos/soccer/500/819.png'),
        ('2024010', 'https://a.espncdn.com/i/teamlogos/soccer/500/819.png'),
        ('2024011', 'https://a.espncdn.com/i/teamlogos/soccer/500/819.png'),
        ('2024012', 'https://a.espncdn.com/i/teamlogos/soccer/500/819.png');`)
        console.log('ProfileImages Data inserted successfully')

    } catch (error) {
        console.error('Error inserting data: ', error)
    }
} 

async function createTable(){
    try {
        // Alunos table definition
        await pool.query(`CREATE TABLE IF NOT EXISTS Alunos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            matricula VARCHAR(191) NOT NULL UNIQUE,
            cpf VARCHAR(191) NOT NULL UNIQUE,
            nome VARCHAR(191) NOT NULL,
            serie ENUM('F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'M1', 'M2', 'M3') NOT NULL,
            created TIMESTAMP NOT NULL DEFAULT NOW()
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        console.log('Table Alunos created successfully');

        // ProfileImages table definition
        await pool.query(`CREATE TABLE IF NOT EXISTS ProfileImages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            matricula VARCHAR(191) NOT NULL UNIQUE,
            url TEXT NOT NULL,
            created TIMESTAMP NOT NULL DEFAULT NOW()
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        console.log('Table ProfileImages created successfully');

        // trigger for 'matricula' automatic creation
        await pool.query(`
        CREATE TRIGGER create_matricula BEFORE INSERT ON Alunos
        FOR EACH ROW
        BEGIN
            DECLARE db_id INT;
            SELECT id INTO db_id FROM Alunos ORDER BY id DESC LIMIT 1;
            IF db_id IS NULL THEN
                SET db_id = 0;
            END IF;
            SET NEW.matricula = CONCAT('20240', db_id + 1);
        END;`)

    } catch (error) {
        console.error('Error creating table: ', error)
    } 
}

async function createDatabase(){
    try {
        await pool.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.MYSQL_DATABASE}`)
        await pool.query(`USE ${process.env.MYSQL_DATABASE}`)
        await createTable()
        await populateDatabase()
        console.log('Database created successfully')
    } catch (error) {
        console.error('Error creating database: ', error)
    }
}

createDatabase()
