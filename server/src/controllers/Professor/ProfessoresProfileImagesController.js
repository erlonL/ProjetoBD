import pool from '../../db.js';

async function getProfileImage(req, res){
    try{
        const { codigo_prof } = req.params;
        
        const [image] = await pool.query(`
        SELECT * FROM ProfessoresProfileImages
        WHERE codigo_prof_frn = ?`, [codigo_prof]);

        if(image.length === 0){
            return res.status(404).json({
                error: true,
                message: "Imagem não encontrada"
            })
        }

        return res.json(image[0]);
    }catch(error){
        return res.status(400).json({
            error: true,
            message: error.message
        })
    }
}

async function updateProfileImage(req, res){
    try{
        const { codigo_prof, url } = req.body;

        const [imageExists] = await pool.query(`
        SELECT * FROM ProfessoresProfileImages
        WHERE codigo_prof_frn = ?`, [codigo_prof]);

        if(imageExists.length === 0){
            return res.status(404).json({
                error: true,
                message: "Imagem não encontrada"
            })
        }

        const [updated] = await pool.query(`
        UPDATE ProfessoresProfileImages
        SET url = ?
        WHERE codigo_prof_frn = ?`, [url, codigo_prof]);

        if(updated.affectedRows === 1){
            return res.json({
                codigo_prof: imageExists.codigo_prof,
                url: url,
                message: "Imagem atualizada com sucesso"
            })
        }

    }catch(error){
        return res.status(400).json({
            error: true,
            message: error.message
        })
    }
}

async function deleteProfileImage(req, res){
    try{
        const { codigo_prof } = req.params;

        const [imageExists] = await pool.query(`
        SELECT * FROM ProfessoresProfileImages
        WHERE codigo_prof_frn = ?`, [codigo_prof]);

        if(imageExists.length === 0){
            return res.status(404).json({
                error: true,
                message: "Imagem não encontrada"
            })
        }

        const [deleted] = await pool.query(`
        DELETE FROM ProfessoresProfileImages
        WHERE codigo_prof_frn = ?`, [codigo_prof]);

        if(deleted.affectedRows === 1){
            return res.json({
                message: "Imagem deletada com sucesso"
            })
        }

    }catch(error){
        return res.status(400).json({
            error: true,
            message: error.message
        })
    }
}

async function createProfileImage(req, res){
    try{
        const { codigo_prof, url } = req.body;

        const [imageExists] = await pool.query(`
        SELECT * FROM ProfessoresProfileImages
        WHERE codigo_prof_frn = ?`, [codigo_prof]);

        if(imageExists.length > 0){
            return res.status(400).json({
                error: true,
                message: "Imagem já existe"
            })
        }

        const [created] = await pool.query(`
        INSERT INTO ProfessoresProfileImages (codigo_prof_frn, url)
        VALUES (?, ?)`, [codigo_prof, url]);

        if(created.affectedRows === 1){
            return res.json({
                codigo_prof,
                url,
                message: "Imagem criada com sucesso"
            })
        }

    }catch(error){
        return res.status(400).json({
            error: true,
            message: error.message
        })
    }
}

const ProfessoresPIMGController = {
    getProfileImage,
    updateProfileImage,
    deleteProfileImage,
    createProfileImage
}

export default ProfessoresPIMGController;