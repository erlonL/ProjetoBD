CREATE DATABASE IF NOT EXISTS escola;
USE escola;

-- // Alunos table definition
CREATE TABLE IF NOT EXISTS Alunos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    matricula VARCHAR(191) NOT NULL UNIQUE,
    cpf VARCHAR(191) NOT NULL UNIQUE,
    nome VARCHAR(191) NOT NULL,
    serie ENUM('F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'M1', 'M2', 'M3') NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW()
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- // ProfileImages table definition
CREATE TABLE IF NOT EXISTS ProfileImages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    matricula VARCHAR(191) NOT NULL UNIQUE,
    url TEXT NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW()
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- // trigger for 'matricula' automatic creation
CREATE TRIGGER create_matricula BEFORE INSERT ON Alunos
    FOR EACH ROW
    BEGIN
        DECLARE db_id INT;
        SELECT id INTO db_id FROM Alunos ORDER BY id DESC LIMIT 1;
        IF db_id IS NULL THEN
            SET db_id = 0;
        END IF;
        SET NEW.matricula = CONCAT('20240', db_id + 1);
    END;