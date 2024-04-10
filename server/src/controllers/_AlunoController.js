async function listAlunos(req, res) {
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
            }
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
    }catch(error){
        return res.status(400).json({
            error: true,
            message: error.message
        })
    }
}
// async function listAlunosBySerie(req, res) {
//     try {
//         const { page = 1 } = req.query;
//         const limit = 10;

//         const { serie } = req.params;

//         const alunos = await prisma.aluno.findMany({
//             where: {
//                 serie: serie as Serie // Convert serie to Serie (enables use of ENUM) type
//             }
//             skip: (Number(page) - 1) * limit,
//             take: limit
//         });

//         return res.json(alunos);
//     } catch (error) {
//         return res.status(400).json({
//             error: true,
//             message: error.message
//         })
//     }
// }
async function findAluno(req, res) {
    // find by matricula (string)
    try{
        const { matricula } = req.params;
        const aluno = await prisma.aluno.findUnique({
            where: { matricula: matricula as string}
        });

        return res.json(aluno);
    }
    catch(error){
        return res.status(400).json({
            error: true,
            message: error.message
        })
    }
}
async function updateAluno(req, res) {
    try{
        const { matricula } = req.params;
        const { nome, cpf, serie } = req.body;
        const aluno = await prisma.aluno.update({
            where: {
                matricula: matricula as string
            }
            data: {
                nome,
                cpf,
                serie
            }
        });

        return res.json(aluno);
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
        const { id = null } = req.query;

        const alunoExists = await prisma.aluno.findUnique({ where: { matricula: matricula as string } });

        if(!alunoExists){
            return res.status(400).json({
                error: true,
                message: "Aluno não encontrado"
            })
        }

        if(id){
            await prisma.aluno.delete({
                where: {
                    id: Number(id)
                }
            });

            return res.json({
                error: false,
                message: "Aluno deletado com sucesso"
            })
        }

        await prisma.aluno.delete({
            where: {
                matricula: matricula as string
            }
        });

        return res.json({
            error: false,
            message: "Aluno deletado com sucesso"
        })
    }catch(error){
        return res.status(400).json({
            error: true,
            message: error.message
        })
    }
}
async function totalAlunos(req, res) {
    const { serie } = req.query;
    if (serie === 'ALL'){
        try{
            const total = await prisma.aluno.count();

            return res.json(total);
        }catch(error){
            return res.status(400).json({
                error: true,
                message: error.message
            })
        }
    }
    try{
        const total = await prisma.aluno.count({
            where: {
                serie: serie as Serie
            }
        });
        return res.json(total);
    }catch(error){
        return res.status(400).json({
            error: true,
            message: error.message
        })
    }
}
async function getColumns(req, res) {
    try{
        const columns = await prisma.aluno.findMany({
            select: {
                matricula: true,
                nome: true,
                serie: true
            }
            take: 1
        });

        return res.json(Object.keys(columns[0]));
    }catch(error){
        return res.status(400).json({
            error: true,
            message: error.message
        })

    }
}