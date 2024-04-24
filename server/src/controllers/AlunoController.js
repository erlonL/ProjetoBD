import pool from '../db.js';

async function createAluno(req, res) {
    try{
        const { nome, cpf, serie } = req.body;

        const [alunoExists] = await pool.query("SELECT * FROM Alunos WHERE cpf = ?", [cpf]);

        console.log(alunoExists)
        if(alunoExists.length > 0){
            return res.status(400).json({
                error: true,
                message: "Aluno já cadastrado"
            })
        }

        const data = {
            nome,
            cpf,
            serie
        }

        const [aluno] = await pool.query(`
        INSERT INTO Alunos 
        (cpf, nome, serie) 
        VALUES (?, ?, ?)`, 
        [cpf, nome, serie]);

        if(aluno.affectedRows === 1){
            return res.status(201).json(data);
        }

    }catch(error){
        return res.status(400).json({
            error: true,
            message: error.message
        })
    }
}

async function listAlunos(req, res) {
    try{
        const { page = 1 } = req.query;
        const { serie } = req.query;
        const limit = 12;

        if(serie === 'ALL'){
            const [alunos] = await pool.query(`
            SELECT matricula, nome, serie FROM Alunos
            ORDER BY nome ASC
            LIMIT ?, ?`, [(page - 1) * limit, limit]);

            return res.json(alunos);
        }

        const [alunos] = await pool.query(`
        SELECT matricula, nome, serie FROM Alunos
        WHERE serie = ?
        ORDER BY nome ASC
        LIMIT ?, ?`, [serie, (page - 1) * limit, limit]);
        
        return res.json(alunos);
    }catch(error){
        return res.status(400).json({
            error: true,
            message: error.message
        })
    }
}

async function totalAlunos(req, res) {
    try{
        const { serie } = req.query;
        if (serie === 'ALL'){
            try{
                const [total] = await pool.query("SELECT COUNT(*) as total FROM Alunos");

                return res.json(total[0].total);
            }catch(error){
                return res.status(400).json({
                    error: true,
                    message: error.message
                })
            }
        }

        const [total] = await pool.query(`
        SELECT COUNT(*) as total 
        FROM Alunos
        WHERE serie = ?`, [serie]);

        return res.json(total[0].total);
    }catch(error){
        return res.status(400).json({
            error: true,
            message: error.message
        })
    }
}

async function deleteAluno(req, res) {
    try{
        const { matricula } = req.query;
        const { id = null } = req.query;

        if(id){
            const [alunoExists] = await pool.query(`
            SELECT * FROM Alunos
            WHERE id = ?`, [id]);
            
            if(alunoExists.length === 0){
                return res.status(404).json({
                    error: true,
                    message: "Aluno não encontrado"
                })
            }

            const [deleted] = await pool.query(`
            DELETE FROM Alunos
            WHERE id = ?`, [id]);

            if(deleted.affectedRows === 1){
                return res.json({
                    message: "Aluno deletado com sucesso"
                })
            }
        }

        const [alunoExists] = await pool.query(`
        SELECT * FROM Alunos
        WHERE matricula = ?`, [matricula]);

        if(alunoExists.length === 0){
            return res.status(404).json({
                error: true,
                message: "Aluno não encontrado"
            })
        }

        const [deleted] = await pool.query(`
        DELETE FROM Alunos
        WHERE matricula = ?`, [matricula]);

        if(deleted.affectedRows === 1){
            return res.json({
                message: "Aluno deletado com sucesso"
            })
        }
    }catch(error){
        return res.status(400).json({
            error: true,
            message: error.message
        })
    
    }
}

async function updateAluno(req, res) {
    try{
        const { matricula } = req.params;
        const { nome, cpf, serie } = req.body;

        const [aluno] = await pool.query(`
        UPDATE Alunos
        SET nome = ?, cpf = ?, serie = ?
        WHERE matricula = ?`, [nome, cpf, serie, matricula]);

        if(aluno.affectedRows === 1){
            return res.json({
                message: "Aluno atualizado com sucesso"
            })
        }

    }catch(error){
        return res.status(400).json({
            error: true,
            message: error.message
        })
    }
}

async function findAluno(req, res) {
    try{
        const { matricula } = req.params;

        const [aluno] = await pool.query(`
        SELECT * FROM Alunos
        WHERE matricula = ?`, [matricula]);

        if(aluno.length === 0){
            return res.status(404).json({
                error: true,
                message: "Aluno não encontrado"
            })
        }

        return res.json(aluno[0]);
    }catch(error){
        return res.status(400).json({
            error: true,
            message: error.message
        })
    }
}

const AlunoController = {
    createAluno,
    listAlunos,
    totalAlunos,
    deleteAluno,
    updateAluno,
    findAluno
}

export default AlunoController;