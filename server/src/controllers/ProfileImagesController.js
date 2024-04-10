import { Request, Response } from 'express';

export default {
    async updateProfileImage(req, res) {
        try{
            const { matricula, url } = req.body;

            const ProfileImageExists = await prisma.profileImages.findFirst({ where: { alunoMatricula : matricula } });

            if(!ProfileImageExists){
                return res.status(400).json({
                    error: true,
                    message: "Imagem de perfil não encontrada"
                })
            }

            const profileImage = await prisma.profileImages.update({
                where: {
                    alunoMatricula: matricula
                },
                data: {
                    url
                }
            });

            return res.json(profileImage);
            
            }catch(error: any){
                return res.status(400).json({
                    error: true,
                    message: error.message
                })
            }
    },
    async getProfileImage(req: Request, res: Response) {
        try{
            const { matricula } = req.params;
            const profileImage = await prisma.profileImages.findFirst({
                where: { alunoMatricula: matricula as string }
            });

            return res.json(profileImage);
        }catch(error: any){
            return res.status(400).json({
                error: true,
                message: error.message
            })
        }
    },
    async deleteProfileImage(req: Request, res: Response) {
        try{
            const { matricula } = req.query;
            const { id = null } = req.query;

            const profileImageExists = await prisma.profileImages.findFirst({ where: { alunoMatricula: matricula as string } });

            if(!profileImageExists){
                return res.status(400).json({
                    error: true,
                    message: "Imagem de perfil não encontrada"
                })
            }

            const profileImage = await prisma.profileImages.delete({
                where: {
                    alunoMatricula: matricula as string
                }
            });

            return res.json(profileImage);
        }catch(error: any){
            return res.status(400).json({
                error: true,
                message: error.message
            })
        }
    },
    async createProfileImage(req: Request, res: Response) {
        try{
            const { matricula, url } = req.body;

            const profileImageExists = await prisma.profileImages.findFirst({ where: { alunoMatricula: matricula } });

            if(profileImageExists){
                return res.status(400).json({
                    error: true,
                    message: "Imagem de perfil já existe."
                });
            }

            const profileImage = await prisma.profileImages.create({
                data: {
                    url,
                    alunoMatricula: matricula
                    }
                });

            return res.json(profileImage);
        }catch(error: any){
            return res.status(400).json({
                error: true,
                message: error.message
            })
        }
    }
}