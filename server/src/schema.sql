CREATE DATABASE IF NOT EXISTS escola;
USE escola;

-- // Alunos table definition
CREATE TABLE IF NOT EXISTS Alunos (
    id_aluno INT AUTO_INCREMENT,
    cpf_aluno VARCHAR(191) NOT NULL UNIQUE,
    nome_aluno VARCHAR(191) NOT NULL,
    turma ENUM('T1', 'T2', 'T3') NOT NULL,
    matricula_aluno VARCHAR(191) NOT NULL UNIQUE,
    created TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id_aluno)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- // AlunosProfileImages table definition
CREATE TABLE IF NOT EXISTS AlunosProfileImages (
    id INT AUTO_INCREMENT,
    matricula_aluno_frn VARCHAR(191) NOT NULL UNIQUE,
    url TEXT NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    FOREIGN KEY (matricula_aluno_frn) REFERENCES Alunos(matricula_aluno) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- // trigger for 'matricula' automatic creation
CREATE TRIGGER create_matricula_aluno BEFORE INSERT ON Alunos
    FOR EACH ROW
    BEGIN
        DECLARE db_id INT;
        SELECT id_aluno INTO db_id FROM Alunos ORDER BY id_aluno DESC LIMIT 1;
        IF db_id IS NULL THEN
            SET db_id = 0;
        END IF;
        SET NEW.matricula_aluno = CONCAT('20240', db_id + 1);
    END;

-- // Professores table definition
CREATE TABLE IF NOT EXISTS Professores (
    id_prof INT AUTO_INCREMENT,
    nome_prof VARCHAR(191) NOT NULL,
    cpf_prof VARCHAR(191) NOT NULL UNIQUE,
    salario_prof DECIMAL(10, 2) NOT NULL,
    email_prof VARCHAR(191),
    codigo_prof VARCHAR(191) NOT NULL UNIQUE,
    created TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id_prof)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- // ProfessoresProfileImages table definition
CREATE TABLE IF NOT EXISTS ProfessoresProfileImages (
    id INT AUTO_INCREMENT,
    codigo_prof_frn VARCHAR(191) NOT NULL UNIQUE,
    url TEXT NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    FOREIGN KEY (codigo_prof_frn) REFERENCES Professores(codigo_prof) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- // trigger for 'codigo_prof' automatic creation
CREATE TRIGGER create_codigo_prof BEFORE INSERT ON Professores
    FOR EACH ROW
    BEGIN
        DECLARE db_id INT;
        SELECT id_prof INTO db_id FROM Professores ORDER BY id_prof DESC LIMIT 1;
        IF db_id IS NULL THEN
            SET db_id = 0;
        END IF;
        SET NEW.codigo_prof = CONCAT('202400', db_id + 1);
    END;

-- // Disciplinas table definition
CREATE TABLE IF NOT EXISTS Disciplinas (
    nome_disci VARCHAR(191) NOT NULL,
    codigo_disci INT NOT NULL UNIQUE,
    codigo_prof_frn VARCHAR(191) NOT NULL,
    PRIMARY KEY (codigo_disci),
    FOREIGN KEY (codigo_prof_frn) REFERENCES Professores(codigo_prof) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- // Matriculado table definition
CREATE TABLE IF NOT EXISTS Matriculado (
    id INT AUTO_INCREMENT,
    matricula_aluno_frn VARCHAR(191) NOT NULL,
    codigo_disci_frn INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (matricula_aluno_frn) REFERENCES Alunos(matricula_aluno) ON DELETE CASCADE,
    FOREIGN KEY (codigo_disci_frn) REFERENCES Disciplinas(codigo_disci) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;