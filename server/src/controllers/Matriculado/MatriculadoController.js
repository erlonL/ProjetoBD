import pool from "../../db.js";

async function createMatricula(req, res) {
    try{
        const { matricula_aluno_frn, codigo_disci_frn } = req.body;

        const [matriculado] = await pool.query(`
        INSERT INTO Matriculado (matricula_aluno_frn, codigo_disci_frn)
        VALUES (?, ?)`, [matricula_aluno_frn, codigo_disci_frn]);

        if(matriculado.affectedRows === 0){
            return res.status(400).json({
                error: true,
                message: "Erro ao matricular aluno"
            })
        }

        return res.status(201).json({
            matricula_aluno_frn,
            codigo_disci_frn
        });

    } catch(error){
        return res.status(400).json({
            error: true,
            message: error.message
        })
    }
}

async function listMatriculas(req, res) {
    try{
        const { page = 1 } = req.query;
        const limit = 12;

        const [matriculas] = await pool.query(`
        SELECT matricula_aluno_frn, codigo_disci_frn FROM Matriculado
        ORDER BY matricula_aluno_frn ASC
        LIMIT ?, ?`, [(page - 1) * limit, limit]);

        return res.status(200).json(matriculas);
    } catch(error){
        return res.status(400).json({
            error: true,
            message: error.message
        })
    }
}

async function deleteMatricula(req, res) {
    try{
        const { matricula_aluno_frn, codigo_disci_frn } = req.body;

        const [matriculado] = await pool.query(`
        SELECT * FROM Matriculado
        WHERE matricula_aluno_frn = ? AND codigo_disci_frn = ?`, [matricula_aluno_frn, codigo_disci_frn]);

        if(matriculado.length === 0){
            return res.status(404).json({
                error: true,
                message: "Matricula não encontrada"
            })
        }

        const [deleted] = await pool.query(`
        DELETE FROM Matriculado
        WHERE matricula_aluno_frn = ? AND codigo_disci_frn = ?`, [matricula_aluno_frn, codigo_disci_frn]);

        if(deleted.affectedRows === 1){
            return res.json({
                message: "Matricula deletada com sucesso"
            })
        }

    } catch(error){
        return res.status(400).json({
            error: true,
            message: error.message
        })
    }
}

async function findMatriculas(req, res) {
    try{
        const { matricula_aluno_frn } = req.params;

        const [matriculas] = await pool.query(`
        SELECT matricula_aluno_frn, codigo_disci_frn FROM Matriculado
        WHERE matricula_aluno_frn = ?`, [matricula_aluno_frn]);

        return res.status(200).json(matriculas);
    } catch(error){
        return res.status(400).json({
            error: true,
            message: error.message
        })
    }
}

const MatriculadoController = {
    createMatricula,
    listMatriculas,
    deleteMatricula,
    findMatriculas
}

export default MatriculadoController;