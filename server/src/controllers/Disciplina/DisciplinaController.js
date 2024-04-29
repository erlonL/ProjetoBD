import pool from "../../db.js";

async function createDisciplina(req, res) {
    try{
        const { nome_disci, codigo_disci, codigo_prof_frn } = req.body;

        const [disciplinaExists] = await pool.query(`
        SELECT * FROM Disciplinas
        WHERE codigo_disci = ?`, [codigo_disci]);

        if(disciplinaExists.length > 0){
            return res.status(400).json({
                error: true,
                message: "Disciplina já cadastrada"
            })
        }

        const [disciplina] = await pool.query(`
        INSERT INTO Disciplinas (nome_disci, codigo_disci, codigo_prof_frn)
        VALUES (?, ?, ?)`, [nome_disci, codigo_disci, codigo_prof_frn]);

        if(disciplina.affectedRows === 0){
            return res.status(400).json({
                error: true,
                message: "Erro ao cadastrar disciplina"
            })
        }

        return res.status(201).json({
            nome_disci,
            codigo_disci,
            codigo_prof_frn
        });
    } catch(error){
        return res.status(400).json({
            error: true,
            message: error.message
        })
    }
}

async function listDisciplinas(req, res) {
    try{
        const { page = 1 } = req.query;
        const limit = 12;

        const [disciplinas] = await pool.query(`
        SELECT nome_disci, codigo_disci, codigo_prof_frn FROM Disciplinas
        ORDER BY nome_disci ASC
        LIMIT ?, ?`, [(page - 1) * limit, limit]);

        return res.status(200).json(disciplinas);
    } catch(error){
        return res.status(400).json({
            error: true,
            message: error.message
        })
    }
}

async function updateDisciplina(req, res) {
    try{
        const { nome_disci, codigo_disci, codigo_prof_frn } = req.body;

        const [disciplinaExists] = await pool.query(`
        SELECT * FROM Disciplinas
        WHERE codigo_disci = ?`, [codigo_disci]);

        if(disciplinaExists.length === 0){
            return res.status(404).json({
                error: true,
                message: "Disciplina não encontrada"
            })
        }

        const [updated] = await pool.query(`
        UPDATE Disciplinas
        SET nome_disci = ?, codigo_prof_frn = ?
        WHERE codigo_disci = ?`, [nome_disci, codigo_prof_frn, codigo_disci]);

        if(updated.affectedRows === 1){
            return res.json({
                nome_disci,
                codigo_disci,
                codigo_prof_frn,
                message: "Disciplina atualizada com sucesso"
            })
        }
    } catch(error) {
        return res.status(400).json({
            error: true,
            message: error.message
        })
    }
}

async function deleteDisciplina(req, res) {
    try{
        const { codigo_disci } = req.body;

        const [disciplinaExists] = await pool.query(`
        SELECT * FROM Disciplinas
        WHERE codigo_disci = ?`, [codigo_disci]);

        if(disciplinaExists.length === 0){
            return res.status(404).json({
                error: true,
                message: "Disciplina não encontrada"
            })
        }

        const [deleted] = await pool.query(`
        DELETE FROM Disciplinas
        WHERE codigo_disci = ?`, [codigo_disci]);

        if(deleted.affectedRows === 1){
            return res.json({
                message: "Disciplina deletada com sucesso"
            })
        }
    } catch(error) {
        return res.status(400).json({
            error: true,
            message: error.message
        })
    }
}

async function findDisciplina(req, res) {
    try{
        const { codigo_disci } = req.params;

        const [disciplina] = await pool.query(`
        SELECT nome_disci, codigo_disci, codigo_prof_frn FROM Disciplinas
        WHERE codigo_disci = ?`, [codigo_disci]);

        if(disciplina.length === 0){
            return res.status(404).json({
                error: true,
                message: "Disciplina não encontrada"
            })
        }

        return res.json(disciplina[0]);
    } catch(error) {
        return res.status(400).json({
            error: true,
            message: error.message
        })
    }
}

async function totalDisciplinas(req, res) {
    try{
        const [total] = await pool.query(`
        SELECT COUNT(*) AS total FROM Disciplinas`);

        return res.json(total[0]);
    } catch(error) {
        return res.status(400).json({
            error: true,
            message: error.message
        })
    }
}

async function DisciplinaMore(req, res) {
    try{
        const { codigo_disci } = req.params;

        const [disciplina] = await pool.query(`
        SELECT nome_disci, codigo_disci, codigo_prof_frn FROM Disciplinas
        WHERE codigo_disci = ?`, [codigo_disci]);

        if(disciplina.length === 0){
            return res.status(404).json({
                error: true,
                message: "Disciplina não encontrada"
            })
        }

        const [professorInfo] = await pool.query(`
        SELECT nome_prof, email_prof, codigo_prof FROM Professores
        WHERE codigo_prof = ?`, [disciplina[0].codigo_prof_frn]);

        const [professorIMG] = await pool.query(`
        SELECT url FROM ProfessoresProfileImages
        WHERE codigo_prof_frn = ?`, [disciplina[0].codigo_prof_frn]);

        const Professor = {
            ...professorInfo[0],
            ...professorIMG[0]
        };
        
        console.log(Professor);

        const Disciplina = {
            nome_disci: disciplina[0].nome_disci,
            codigo_disci: disciplina[0].codigo_disci
        }

        const [matriculas] = await pool.query(`
        SELECT matricula_aluno_frn FROM Matriculado
        WHERE codigo_disci_frn = ?`, [codigo_disci]);

        if(matriculas.length === 0){
            return res.json({
                Disciplina,
                Alunos: [{}]
            });
        }

        let alunos = [{}];
        let alunos_pimg = [{}];

        for(let i = 0; i < matriculas.length; i++){
            const [aluno] = await pool.query(`
            SELECT nome_aluno, matricula_aluno, turma FROM Alunos
            WHERE matricula_aluno = ?`, [matriculas[i].matricula_aluno_frn]);

            alunos.push(aluno[0]);
        }
        alunos.shift();

        for(let i = 0; i < matriculas.length; i++){
            const [aluno_img] = await pool.query(`
            SELECT url FROM AlunosProfileImages
            WHERE matricula_aluno_frn = ?`, [matriculas[i].matricula_aluno_frn]);

            alunos_pimg.push(aluno_img[0]);
        }
        alunos_pimg.shift();

        const Alunos = alunos.map((aluno, index) => {
            return {
                ...aluno,
                ...alunos_pimg[index]
            }
        }
        );

        return res.json({
            Disciplina,
            Professor,
            Alunos
        });

    } catch(error) {
        return res.status(400).json({
            error: true,
            message: error.message
        })
    }
}

const DisciplinaController = {
    createDisciplina,
    listDisciplinas,
    updateDisciplina,
    deleteDisciplina,
    findDisciplina,
    totalDisciplinas,
    DisciplinaMore
}

export default DisciplinaController;