import { Request, Response } from 'express';
import { prisma } from '../database';

export default {
    async createAluno(req: Request, res: Response) {
        try{
            const { nome, cpf, serie } = req.body;

            const alunoExists = await prisma.aluno.findFirst({ where: { cpf } });

            if(alunoExists){
                return res.status(400).json({
                    error: true,
                    message: "Aluno já cadastrado"
                })
            }
            
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
            const { page = 1 } = req.query;
            const limit = 10;

            // Paginação
            const alunos = await prisma.aluno.findMany({
                skip: (Number(page) - 1) * limit,
                take: limit
            });

            // const alunos = await prisma.aluno.findMany();

            const data = alunos.map((aluno) => {
                return {
                    matricula: aluno.matricula,
                    nome: aluno.nome,
                    serie: aluno.serie
                }
            });

            return res.json(data);
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

            for(let i = 0; i < data.length; i++){
                const alunoExists = await prisma.aluno.findFirst({ where: { cpf: data[i].cpf } });

                if(alunoExists){
                    return res.status(400).json({
                        error: true,
                        message: "Algum aluno já foi cadastrado"
                    })
                }
            }

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