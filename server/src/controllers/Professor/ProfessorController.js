import pool from '../../db.js';

async function createProfessor(req, res) {
    try{
        const { nome, cpf, salario, email = 'professor@conceicao.br' } = req.body;

        const [professorExists] = await pool.query("SELECT * FROM Professores WHERE cpf_prof = ?", [cpf]);

        if(professorExists.length > 0){
            return res.status(400).json({
                error: true,
                message: "Professor já cadastrado"
            })
        }

        const [professor] = await pool.query(`
        INSERT INTO Professores
        (nome_prof, cpf_prof, salario_prof, email_prof)
        VALUES (?, ?, ?, ?)`,
        [nome, cpf, salario, email]);

        if(professor.affectedRows === 0){
            return res.status(400).json({
                error: true,
                message: "Erro ao cadastrar professor"
            })
        }

        const professorCodigo = await pool.query(`
        SELECT codigo_prof FROM Professores
        WHERE cpf_prof = ?`, [cpf]);

        return res.status(201).json({
            codigo: professorCodigo[0][0].codigo_prof,
            nome,
            cpf,
            salario,
            email
        });
    }catch(error){
        return res.status(400).json({
            error: true,
            message: error.message
        })
    }
}

async function listProfessores(req, res) {
    try{
        const { page = 1 } = req.query;
        const limit = 12;

        const [professores] = await pool.query(`
        SELECT codigo_prof, nome_prof, salario_prof, email_prof FROM Professores
        ORDER BY nome_prof ASC
        LIMIT ?, ?`, [(page - 1) * limit, limit]);

        return res.status(200).json(professores);
    }catch(error){
        return res.status(400).json({
            error: true,
            message: error.message
        })
    }
}

async function updateProfessor(req, res) {
    try{
        const { codigo } = req.params;
        const { nome, cpf, salario, email } = req.body;

        const [professorExists] = await pool.query("SELECT * FROM Professores WHERE codigo_prof = ?", [codigo]);

        if(professorExists.length === 0){
            return res.status(400).json({
                error: true,
                message: "Professor não encontrado"
            })
        }

        const [professor] = await pool.query(`
        UPDATE Professores
        SET nome_prof = ?, cpf_prof = ?, salario_prof = ?, email_prof = ?
        WHERE codigo_prof = ?`,
        [nome, cpf, salario, email, codigo]);

        if(professor.affectedRows === 0){
            return res.status(400).json({
                error: true,
                message: "Erro ao atualizar professor"
            })
        }

        return res.status(200).json({
            codigo,
            nome,
            cpf,
            salario,
            email
        });
    }catch(error){
        return res.status(400).json({
            error: true,
            message: error.message
        })
    }
}

async function deleteProfessor(req, res) {
    try{
        const { codigo } = req.query;

        const [professorExists] = await pool.query("SELECT * FROM Professores WHERE codigo_prof = ?", [codigo]);

        if(professorExists.length === 0){
            return res.status(400).json({
                error: true,
                message: "Professor não encontrado"
            })
        }

        const [professor] = await pool.query(`
        DELETE FROM Professores
        WHERE codigo_prof = ?`, [codigo]);

        if(professor.affectedRows === 0){
            return res.status(400).json({
                error: true,
                message: "Erro ao deletar professor"
            })
        }

        return res.status(200).json({
            message: "Professor deletado com sucesso"
        });

    }catch(error){
        return res.status(400).json({
            error: true,
            message: error.message
        })
    }
}

async function findProfessor(req, res) {
    try{
        const { codigo } = req.params;

        const [professor] = await pool.query(`
        SELECT codigo_prof, nome_prof, cpf_prof, salario_prof, email_prof FROM Professores
        WHERE codigo_prof = ?`, [codigo]);

        if(professor.length === 0){
            return res.status(404).json({
                error: true,
                message: "Professor não encontrado"
            })
        }

        return res.status(200).json(professor[0]);
    } catch(error){
        return res.status(400).json({
            error: true,
            message: error.message
        })
    }
}

async function totalProfessores(req, res) {
    try{
        const [total] = await pool.query(`
        SELECT COUNT(*) as total FROM Professores`);

        return res.json(total[0].total);
    }catch(error){
        return res.status(400).json({
            error: true,
            message: error.message
        })
    }
}

async function ProfessorName(req, res) {
    try{
        const { codigo } = req.params;

        const [professor] = await pool.query(`
        SELECT nome_prof FROM Professores
        WHERE codigo_prof = ?`, [codigo]);

        if(professor.length === 0){
            return res.status(404).json({
                error: true,
                message: "Professor não encontrado"
            })
        }

        return res.status(200).json(professor[0]);
    } catch(error){
        return res.status(400).json({
            error: true,
            message: error.message
        })
    }
}

const ProfessorController = {
    createProfessor,
    listProfessores,
    updateProfessor,
    deleteProfessor,
    findProfessor,
    totalProfessores,
    ProfessorName
}

export default ProfessorController;