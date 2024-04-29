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

const DisciplinaController = {
    createDisciplina,
    listDisciplinas,
    updateDisciplina,
    deleteDisciplina,
    findDisciplina,
    totalDisciplinas
}

export default DisciplinaController;