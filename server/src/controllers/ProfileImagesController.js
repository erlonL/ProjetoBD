import pool from './../db.js'

async function getProfileImage(req, res){
    try{
        const { matricula } = req.params;
        
        const [image] = await pool.query(`
        SELECT * FROM ProfileImages
        WHERE matricula = ?`, [matricula]);

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
        const { matricula, url } = req.body;

        const [imageExists] = await pool.query(`
        SELECT * FROM ProfileImages
        WHERE matricula = ?`, [matricula]);

        if(imageExists.length === 0){
            return res.status(404).json({
                error: true,
                message: "Imagem não encontrada"
            })
        }

        const [updated] = await pool.query(`
        UPDATE ProfileImages
        SET url = ?
        WHERE matricula = ?`, [url, matricula]);

        if(updated.affectedRows === 1){
            return res.json({
                id: imageExists.id,
                matricula: imageExists.matricula,
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
        const { matricula } = req.query;
        // not available for the time being
        // const { id = null } = req.query;

        
        const profileImageExists = await pool.query(`
        SELECT * FROM ProfileImages
        WHERE matricula = ?`, [matricula]);

        if(profileImageExists.length === 0){
            return res.status(404).json({
                error: true,
                message: "Imagem não encontrada"
            })
        }

        const [deleted] = await pool.query(`
        DELETE FROM ProfileImages
        WHERE matricula = ?`, [matricula]);

        if(deleted.affectedRows === 1){
            return res.json({
                image: profileImageExists[0],
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
        const { matricula, url } = req.body;

        const [imageExists] = await pool.query(`
        SELECT * FROM ProfileImages
        WHERE matricula = ?`, [matricula]);

        if(imageExists.length > 0){
            return res.status(400).json({
                error: true,
                message: "Imagem já existe"
            })
        }

        const [created] = await pool.query(`
        INSERT INTO ProfileImages (matricula, url)
        VALUES (?, ?)`, [matricula, url]);

        if(created.affectedRows === 1){
            return res.json({
                matricula: matricula,
                url: url,
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

const PIMGController = {
    getProfileImage,
    updateProfileImage,
    deleteProfileImage,
    createProfileImage
}

export default PIMGController;