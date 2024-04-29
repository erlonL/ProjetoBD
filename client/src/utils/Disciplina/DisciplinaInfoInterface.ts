import AlunoInfoObject from '../Aluno/AlunoInfoInterface';

interface DisciplinaInfoObject {
    nome: string;
    codigo: string;
    professor: string;
    alunos: AlunoInfoObject[];
}

export default DisciplinaInfoObject;