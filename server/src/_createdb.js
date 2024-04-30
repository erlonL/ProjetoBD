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
        await pool.query(`INSERT INTO Alunos (cpf_aluno, nome_aluno, turma) VALUES
        ('111.222.333-45', 'Everton Ribeiro', 'T1'),
        ('222.333.444-56', 'Gabriel Barbosa', 'T2'),
        ('333.444.555-67', 'Bruno Henrique', 'T3'),
        ('444.555.666-78', 'Diego Ribas', 'T1'),
        ('555.666.777-89', 'Arrascaeta', 'T2'),
        ('666.777.888-90', 'Michael', 'T3'),
        ('777.888.999-01', 'Pedro', 'T1'),
        ('888.999.000-12', 'Gerson', 'T2'),
        ('999.000.111-23', 'Filipe Luís', 'T3'),
        ('000.111.222-34', 'Hugo Souza', 'T1'),
        ('112.222.333-45', 'Rodrigo Caio', 'T2'),
        ('223.333.444-56', 'Willian Arão', 'T3');`)
        console.log('Alunos Data inserted successfully')

        await pool.query(`INSERT INTO AlunosProfileImages (matricula_aluno_frn, url) VALUES
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

        await pool.query(`INSERT INTO Professores (nome_prof, cpf_prof, salario_prof, email_prof) VALUES
        ('Jorge Jesus', '123.456.789-10', 10000.00, 'JorgeJ@conceicao.br'),
        ('Jorge Sampaoli', '234.567.890-11', 9000.00, 'JorgeS@conceicao.br'),
        ('Tite', '345.678.901-12', 8000.00, 'tite@conceicao.br'),
        ('Cuca', '456.789.012-13', 7000.00, 'cucar@conceicao.br'),
        ('Dorival Júnior', '567.890.123-14', 6000.00, 'dorival@conceicao.br'),
        ('Rogério Ceni', '678.901.234-15', 5000.00, 'rogerio@conceicao.br');`)
        console.log('Professores Data inserted successfully')

        await pool.query(`INSERT INTO ProfessoresProfileImages (codigo_prof_frn, url) VALUES
        ('2024001', 'https://ogimg.infoglobo.com.br/in/24459012-d9f-eb8/FT1086A/JORGE-JESUS.jpg'),
        ('2024002', 'https://bolavip.com/__export/1681487732759/sites/bolavip/img/2023/04/14/sampaoli-flamengo-_crop1681487731632.jpg_242310155.jpg'),
        ('2024003', 'https://colunadofla.com/wp-content/uploads/2024/04/tite-flamengo-millonarios.jpg'),
        ('2024004', 'https://static.flaresenha.com/wp/cuca-afirma-nao-ter-recebido-contato-do-flamengo-ate-o-momento-1.jpg'),
        ('2024005', 'https://conteudo.imguol.com.br/c/esporte/1f/2018/10/13/tecnico-dorival-junior-comanda-o-flamengo-no-fla-flu-do-campeonato-brasileiro-1539463065650_v2_3x4.jpg'),
        ('2024006', 'https://conteudo.imguol.com.br/c/esporte/f9/2020/11/21/tecnico-rogerio-ceni-no-duelo-entre-flamengo-e-coritiba-no-maracana-1605998794388_v2_4x3.jpg');`)

        await pool.query(`INSERT INTO Disciplinas (nome_disci, codigo_disci, codigo_prof_frn) VALUES
        ('Matemática', 1, '2024001'),
        ('Português', 2, '2024002'),
        ('Geografia', 3, '2024003'),
        ('História', 4, '2024004'),
        ('Ciências', 5, '2024005'),
        ('Inglês', 6, '2024006');`)
        console.log('Disciplinas Data inserted successfully')

        await pool.query(`INSERT INTO Matriculado (matricula_aluno_frn, codigo_disci_frn) VALUES
        ('202401', 1),
        ('202401', 2),
        ('202401', 3),
        ('202401', 4),
        ('202401', 5),
        ('202401', 6),
        ('202402', 1),
        ('202402', 2),
        ('202402', 3),
        ('202402', 4),
        ('202402', 5),
        ('202402', 6),
        ('202403', 1),
        ('202403', 2),
        ('202403', 3),
        ('202403', 4),
        ('202403', 5),
        ('202403', 6),
        ('202404', 1),
        ('202404', 2),
        ('202404', 4),
        ('202404', 5),
        ('202404', 6),
        ('202405', 1),
        ('202405', 2),
        ('202405', 3),
        ('202405', 4),
        ('202406', 1),
        ('202406', 2),
        ('202406', 3),
        ('202406', 4),
        ('202406', 5),
        ('202406', 6),
        ('202407', 1),
        ('202407', 2),
        ('202408', 2),
        ('202408', 3),
        ('202408', 4),
        ('202408', 5),
        ('202408', 6),
        ('202409', 1),
        ('202409', 2),
        ('202409', 3),
        ('202409', 4),
        ('2024010', 4),
        ('2024010', 5),
        ('2024010', 6),
        ('2024011', 4),
        ('2024011', 5)`)
        console.log('Matriculado Data inserted successfully')


    } catch (error) {
        console.error('Error inserting data: ', error)
    }
} 

async function createTable(){
    try {
        // Alunos table definition
        await pool.query(`CREATE TABLE IF NOT EXISTS Alunos (
            id_aluno INT AUTO_INCREMENT,
            cpf_aluno VARCHAR(191) NOT NULL UNIQUE,
            nome_aluno VARCHAR(191) NOT NULL,
            turma ENUM('T1', 'T2', 'T3') NOT NULL,
            matricula_aluno VARCHAR(191) NOT NULL UNIQUE,
            created TIMESTAMP NOT NULL DEFAULT NOW(),
            PRIMARY KEY (id_aluno)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        console.log('Table Alunos created successfully');

        // ProfileImages table definition
        await pool.query(`CREATE TABLE IF NOT EXISTS AlunosProfileImages (
            id INT AUTO_INCREMENT,
            matricula_aluno_frn VARCHAR(191) NOT NULL UNIQUE,
            url TEXT NOT NULL,
            created TIMESTAMP NOT NULL DEFAULT NOW(),
            PRIMARY KEY (id),
            FOREIGN KEY (matricula_aluno_frn) REFERENCES Alunos(matricula_aluno) ON DELETE CASCADE
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        console.log('Table ProfileImages created successfully');

        // trigger for 'matricula_aluno' automatic creation
        await pool.query(`
        CREATE TRIGGER IF NOT EXISTS create_matricula_aluno BEFORE INSERT ON Alunos
        FOR EACH ROW
        BEGIN
            DECLARE db_id INT;
            SELECT id_aluno INTO db_id FROM Alunos ORDER BY id_aluno DESC LIMIT 1;
            IF db_id IS NULL THEN
                SET db_id = 0;
            END IF;
            SET NEW.matricula_aluno = CONCAT('20240', db_id + 1);
        END;`);
        console.log('Trigger create_matricula created successfully')

        // Professores table definition
        await pool.query(`
        CREATE TABLE IF NOT EXISTS Professores (
            id_prof INT AUTO_INCREMENT,
            nome_prof VARCHAR(191) NOT NULL,
            cpf_prof VARCHAR(191) NOT NULL UNIQUE,
            salario_prof DECIMAL(10, 2) NOT NULL,
            email_prof VARCHAR(191),
            codigo_prof VARCHAR(191) NOT NULL UNIQUE,
            created TIMESTAMP NOT NULL DEFAULT NOW(),
            PRIMARY KEY (id_prof)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        console.log('Table Professores created successfully');

        // ProfessoresProfileImages table definition
        await pool.query(`
        CREATE TABLE IF NOT EXISTS ProfessoresProfileImages (
            id INT AUTO_INCREMENT,
            codigo_prof_frn VARCHAR(191) NOT NULL UNIQUE,
            url TEXT NOT NULL,
            created TIMESTAMP NOT NULL DEFAULT NOW(),
            PRIMARY KEY (id),
            FOREIGN KEY (codigo_prof_frn) REFERENCES Professores(codigo_prof) ON DELETE CASCADE
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);

        // trigger for 'codigo_prof' automatic creation
        await pool.query(`
        CREATE TRIGGER IF NOT EXISTS create_codigo_prof BEFORE INSERT ON Professores
            FOR EACH ROW
            BEGIN
                DECLARE db_id INT;
                SELECT id_prof INTO db_id FROM Professores ORDER BY id_prof DESC LIMIT 1;
                IF db_id IS NULL THEN
                    SET db_id = 0;
                END IF;
                SET NEW.codigo_prof = CONCAT('202400', db_id + 1);
            END;`);
        console.log('Trigger create_codigo created successfully')
        
        // Disciplinas table definition
        await pool.query(`
        CREATE TABLE IF NOT EXISTS Disciplinas (
            nome_disci VARCHAR(191) NOT NULL,
            codigo_disci INT NOT NULL UNIQUE,
            codigo_prof_frn VARCHAR(191) NOT NULL,
            PRIMARY KEY (codigo_disci),
            FOREIGN KEY (codigo_prof_frn) REFERENCES Professores(codigo_prof) ON DELETE CASCADE
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        console.log('Table Disciplinas created successfully');

        // Matriculado table definition
        await pool.query(`
        CREATE TABLE IF NOT EXISTS Matriculado (
            id INT AUTO_INCREMENT,
            matricula_aluno_frn VARCHAR(191) NOT NULL,
            codigo_disci_frn INT NOT NULL,
            PRIMARY KEY (id),
            FOREIGN KEY (matricula_aluno_frn) REFERENCES Alunos(matricula_aluno) ON DELETE CASCADE,
            FOREIGN KEY (codigo_disci_frn) REFERENCES Disciplinas(codigo_disci) ON DELETE CASCADE
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        console.log('Table Matriculado created successfully');


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
