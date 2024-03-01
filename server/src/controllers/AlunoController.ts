import { Request, Response } from 'express';
import { prisma } from '../database';

export default {
    async createAluno(req: Request, res: Response) {
        try{
            const { nome, cpf, serie } = req.body;
            
            const data = {
                nome,
                cpf,
                serie,
                matricula : ("20240" + Math.floor(Math.random() * 1000).toString())
            }

            const aluno = await prisma.aluno.create({ data });

            return res.status(201).json(aluno);
            // return res.json({
            //     error: false,
            //     message: "Aluno cadastrado com sucesso",
            //     aluno
            // })

        }catch(error: any){
            return res.status(400).json({
                error: true,
                message: error.message
            })
        }
    },
    async listAlunos(req: Request, res: Response) {
        try{
            const alunos = await prisma.aluno.findMany();
            return res.json(alunos);
        }catch(error: any){
            return res.status(400).json({
                error: true,
                message: error.message
            })
        }
    },
    async findAluno(req: Request, res: Response) {
        // find by matricula (string)
        try{
            const { matricula } = req.params;
            const aluno = await prisma.aluno.findUnique({
                where: { matricula }
            });

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
            const aluno = await prisma.aluno.update({
                where: {
                    matricula
                },
                data: {
                    nome,
                    cpf,
                    serie
                }
            });

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
            const { id } = req.params;
            
            await prisma.aluno.delete({
                where: {
                    id: Number(id)
                }
            });

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
    async deleteAlunoByMatricula(req: Request, res: Response) {
        try{
            const { matricula } = req.params;
            await prisma.aluno.delete({
                where: {
                    matricula: matricula
                }
            });

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
    async createAlunoMany(req: Request, res: Response) {
        try{
            const alunos = req.body;
            const data = alunos.map((aluno: any) => {
                return {
                    nome: aluno.nome,
                    cpf: aluno.cpf,
                    serie: aluno.serie,
                    matricula : ("20240" + Math.floor(Math.random() * 1000).toString())
                }
            });

            const result = await prisma.aluno.createMany({
                data
            });

            return res.json(result);
        }catch(error: any){
            return res.status(400).json({
                error: true,
                message: error.message
            })
        }
    }
}