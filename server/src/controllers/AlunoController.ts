import { Request, Response } from 'express';
import { prisma } from '../database';
import { Serie } from '@prisma/client';

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

            let db_id = await prisma.aluno.findFirst({
                select: {
                    id: true
                },
                orderBy: {
                    id: 'desc'
                }
            });

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
            const { serie } = req.query;
            const limit = 12;

            // Paginação
            if (serie === 'ALL'){
                const alunos = await prisma.aluno.findMany({
                    skip: (Number(page) - 1) * limit,
                    take: limit,
                    orderBy: {
                        nome: 'asc'
                    }
                });
                const data = alunos.map((aluno) => {
                    return {
                        matricula: aluno.matricula,
                        nome: aluno.nome,
                        serie: aluno.serie
                    }
                });
                return res.json(data);
            }

            const alunos = await prisma.aluno.findMany({
                where: {
                    serie: serie as Serie // Convert serie to Serie (enables use of ENUM) type
                },
                skip: (Number(page) - 1) * limit,
                take: limit,
                orderBy: {
                    nome: 'asc'
                }
            });

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
    // async listAlunosBySerie(req: Request, res: Response) {
    //     try {
    //         const { page = 1 } = req.query;
    //         const limit = 10;

    //         const { serie } = req.params;

    //         const alunos = await prisma.aluno.findMany({
    //             where: {
    //                 serie: serie as Serie // Convert serie to Serie (enables use of ENUM) type
    //             },
    //             skip: (Number(page) - 1) * limit,
    //             take: limit
    //         });

    //         return res.json(alunos);
    //     } catch (error: any) {
    //         return res.status(400).json({
    //             error: true,
    //             message: error.message
    //         })
    //     }
    // },
    async findAluno(req: Request, res: Response) {
        // find by matricula (string)
        try{
            const { matricula } = req.params;
            const aluno = await prisma.aluno.findUnique({
                where: { matricula: matricula as string}
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
                    matricula: matricula as string
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
                    matricula: matricula as string
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
    // async createAlunoMany(req: Request, res: Response) {
    //     try{
    //         const alunos = req.body;

    //         const data = alunos.map((aluno: any) => {
    //             const db_id = await prisma.aluno.findFirst({
    //                 select: {
    //                     id: true
    //                 },
    //                 orderBy: {
    //                     id: 'desc'
    //                 }
    //             });
    //             return {
    //                 nome: aluno.nome,
    //                 cpf: aluno.cpf,
    //                 serie: aluno.serie,
    //                 matricula : Number("20240" + db_id?.id.toString())
    //             }
    //         });

    //         for(let i = 0; i < data.length; i++){
    //             const alunoExists = await prisma.aluno.findFirst({ where: { cpf: data[i].cpf } });

    //             if(alunoExists){
    //                 return res.status(400).json({
    //                     error: true,
    //                     message: "Algum aluno já foi cadastrado"
    //                 })
    //             }
    //         }

    //         const result = await prisma.aluno.createMany({
    //             data
    //         });

    //         return res.json(result);
    //     }catch(error: any){
    //         return res.status(400).json({
    //             error: true,
    //             message: error.message
    //         })
    //     }
    // }
}