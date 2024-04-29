import pool from '../../db.js';

async function createAluno(req, res) {
    try{
        const { nome, cpf, turma } = req.body;

        const [alunoExists] = await pool.query("SELECT * FROM Alunos WHERE cpf_aluno = ?", [cpf]);

        console.log(alunoExists)
        if(alunoExists.length > 0){
            return res.status(400).json({
                error: true,
                message: "Aluno já cadastrado"
            })
        }

        const [aluno] = await pool.query(`
        INSERT INTO Alunos 
        (cpf_aluno, nome_aluno, turma) 
        VALUES (?, ?, ?)`, 
        [cpf, nome, turma]);

        if(aluno.affectedRows === 0){
            return res.status(400).json({
                error: true,
                message: "Erro ao cadastrar aluno"
            })
        }

        const alunoMatricula = await pool.query(`
        SELECT matricula_aluno FROM Alunos
        WHERE cpf_aluno = ?`, [cpf]);
        
        return res.status(201).json({
            matricula: alunoMatricula[0][0].matricula_aluno
        });
        
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
        const { turma } = req.query;
        const limit = 12;

        if(turma === 'ALL'){
            const [response] = await pool.query(`
            SELECT matricula_aluno, nome_aluno, turma FROM Alunos
            ORDER BY nome_aluno ASC
            LIMIT ?, ?`, [(page - 1) * limit, limit]);
            
            const alunos = response.map(aluno => {
                return {
                    matricula: aluno.matricula_aluno,
                    nome: aluno.nome_aluno,
                    turma: aluno.turma
                }
            })
            return res.json(alunos);
        }

        const [response] = await pool.query(`
        SELECT matricula_aluno, nome_aluno, turma FROM Alunos
        WHERE turma = ?
        ORDER BY nome_aluno ASC
        LIMIT ?, ?`, [turma, (page - 1) * limit, limit]);

        const alunos = response.map(aluno => {
            return {
                matricula: aluno.matricula_aluno,
                nome: aluno.nome_aluno,
                turma: aluno.turma
            }
        })
        
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
        const { turma } = req.query;
        if (turma === 'ALL'){
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
        WHERE turma = ?`, [turma]);

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
        
        const [alunoExists] = await pool.query(`
        SELECT * FROM Alunos
        WHERE matricula_aluno = ?`, [matricula]);

        if(alunoExists.length === 0){
            return res.status(404).json({
                error: true,
                message: "Aluno não encontrado"
            })
        }

        const [deleted] = await pool.query(`
        DELETE FROM Alunos
        WHERE matricula_aluno = ?`, [matricula]);

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
        const { matricula } = req.query;
        const { nome, cpf, turma} = req.body;

        const [alunoInfo] = await pool.query(`
        UPDATE Alunos
        SET nome_aluno = ?, cpf_aluno = ?, turma = ?
        WHERE matricula_aluno = ?`, [nome, cpf, turma, matricula]);
        
        if(alunoInfo.affectedRows === 1){
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
        WHERE matricula_aluno = ?`, [matricula]);

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

async function findAlunoMore(req, res){
    try{
        const { matricula } = req.params;

        const [alunoInfo] = await pool.query(`
        SELECT matricula_aluno, cpf_aluno, nome_aluno, turma FROM Alunos
        WHERE matricula_aluno = ?`, [matricula]);

        if(alunoInfo.length === 0){
            return res.status(404).json({
                error: true,
                message: "Aluno não encontrado"
            })
        }

        var [alunoIMG] = await pool.query(`
        SELECT url FROM AlunosProfileImages
        WHERE matricula_aluno_frn = ?`, [matricula]);

        console.log(alunoIMG);

        if(alunoIMG.length === 0){
            alunoIMG = [{ url: '' }];
        }

        const aluno = {
            matricula: alunoInfo[0].matricula_aluno,
            cpf: alunoInfo[0].cpf_aluno,
            nome: alunoInfo[0].nome_aluno,
            turma: alunoInfo[0].turma,
            img_url: alunoIMG[0].url
        }

        console.log(aluno);

        return res.json(aluno);
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
    findAluno,
    findAlunoMore
}

export default AlunoController;