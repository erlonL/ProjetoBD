import pool from '../db.js';

async function createAluno(req, res) {
    try{
        const { nome, cpf, serie } = req.body;

        const [alunoExists] = await pool.query("SELECT * FROM Alunos WHERE cpf = ?", [cpf]);

        if(alunoExists.length > 0){
            return res.status(400).json({
                error: true,
                message: "Aluno já cadastrado"
            })
        }

        let [db_id] = await pool.query("SELECT id FROM Alunos ORDER BY id DESC LIMIT 1");

        if(!db_id){
            db_id = { id: 0 };
        }

        const matricula = "20240" + db_id?.id.toString();
        
        const data = {
            nome,
            cpf,
            serie,
            matricula
        }

        const [aluno] = await pool.query("INSERT INTO Alunos (matricula, cpf, nome, serie) VALUES (?, ?, ?, ?)", [matricula, cpf, nome, serie]);

        return res.status(201).json(aluno);

    }catch(error){
        return res.status(400).json({
            error: true,
            message: error.message
        })
    }
}

async function listAlunos(req, res) {
    try{
        const [alunos] = await pool.query("SELECT * FROM Alunos");

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
        const [total] = await pool.query("SELECT COUNT(*) as total FROM Alunos");

        return res.json(total[0]);
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
    totalAlunos
}

export default AlunoController;