import { Request, Response } from 'express';
import Aluno from '../database';

export default {
    async createAluno(req: Request, res: Response) {
        try{
            const { nome, cpf, serie } = req.body;

            const alunoExists = await Aluno.findOne({ where: { cpf: cpf } });

            if(alunoExists){
                return res.status(400).json({
                    error: true,
                    message: "Aluno já cadastrado"
                })
            }

            let db_id = null

            try{
                db_id = await Aluno.findOne({ order: [ [ 'id', 'DESC' ]] }).then(
                    (aluno: any) => {
                        return aluno.id;
                    }
                )
            }
            catch(error: any){
                console.log(error);
            }
            
            const id = (db_id === null) ? 1 : db_id + 1;

            const matricula = "20240" + id.toString();
            
            await Aluno.create({ nome, cpf, serie, matricula });

            return res.json({
                error: false,
                message: "Aluno cadastrado com sucesso"
            })
        }catch(error: any){
            return res.status(400).json({
                error: true,
                message: error.message
            })
        }
    },
    async listAlunos(req: Request, res: Response) {
        try{
            const { page = 1 } = req.query;
            const { serie } = req.query;
            const limit = 12;

            // Paginação
            if (serie === 'ALL'){
                const alunos = await Aluno.findAll({ limit, offset: (Number(page) - 1) * limit });
                return res.json(alunos);
            }

            const alunos = await Aluno.findAll({ where: { serie }, limit, offset: (Number(page) - 1) * limit });

            console.log(alunos);

            return res.json(alunos);
        }catch(error: any){
            return res.status(400).json({
                error: true,
                message: error.message
            })
        }
    },
    async findAluno(req: Request, res: Response) {
        try{
            const { matricula } = req.params;
            const aluno = await Aluno.findOne({ where: { matricula } });

            return res.json(aluno);
        }
        catch(error: any){
            return res.status(400).json({
                error: true,
                message: error.message
            })
        }
    },

    async updateAluno(req: Request, res: Response) {
        try{
            const { matricula } = req.params;
            const { nome, cpf, serie } = req.body;
            const aluno = await Aluno.update({ nome, cpf, serie }, { where: { matricula } });

            return res.json(aluno);
        }catch(error: any){
            return res.status(400).json({
                error: true,
                message: error.message
            })
        }
    },

    async deleteAluno(req: Request, res: Response) {
        try{
            const { matricula } = req.query;
            const { id = null } = req.query;

            const alunoExists = await Aluno.findOne({ where: { matricula } });

            if(!alunoExists){
                return res.status(400).json({
                    error: true,
                    message: "Aluno não encontrado"
                })
            }

            if(id){
                await Aluno.destroy({ where: { id } });

                return res.json({
                    error: false,
                    message: "Aluno deletado com sucesso"
                })
            }

            await Aluno.destroy({ where: { matricula } });

            return res.json({
                error: false,
                message: "Aluno deletado com sucesso"
            })
        }catch(error: any){
            return res.status(400).json({
                error: true,
                message: error.message
            })
        }
    },

    async totalAlunos(req: Request, res: Response) {
        const { serie } = req.query;
        if (serie === 'ALL'){
            try{
                const total = await Aluno.count();
                return res.json(total);
            }catch(error: any){
                return res.status(400).json({
                    error: true,
                    message: error.message
                })
            }
        }
        try{
            const total = await Aluno.count({ where: { serie } });
            return res.json(total);
        }catch(error: any){
            return res.status(400).json({
                error: true,
                message: error.message
            })
        }
    }
}