import express from 'express';
import AlunoController from './controllers/Aluno/AlunoController.js';
import AlunosPIMGController from './controllers/Aluno/AlunosProfileImagesController.js';

import ProfessorController from './controllers/Professor/ProfessorController.js';
import ProfessoresPIMGController from './controllers/Professor/ProfessoresProfileImagesController.js';

import DisciplinaController from './controllers/Disciplina/DisciplinaController.js';
import MatriculadoController from './controllers/Matriculado/MatriculadoController.js';

const app = express();
app.use(express.json());
const PORT = 8000;

app.get('/api', (request, response) => {
    response.send('Hello World');
});

// alunos
app.get('/api/alunos', AlunoController.listAlunos);
app.post('/api/aluno', AlunoController.createAluno);
app.delete('/api/aluno', AlunoController.deleteAluno);
app.put('/api/aluno', AlunoController.updateAluno);
app.get('/api/alunos/total', AlunoController.totalAlunos);
app.get('/api/aluno/:matricula', AlunoController.findAluno);
app.get('/api/alunoMore/:matricula', AlunoController.findAlunoMore);

// alunos profile images
app.get('/api/image/aluno/:matricula', AlunosPIMGController.getProfileImage);
app.post('/api/image/aluno', AlunosPIMGController.createProfileImage);
app.delete('/api/image/aluno', AlunosPIMGController.deleteProfileImage);
app.put('/api/image/aluno', AlunosPIMGController.updateProfileImage);

// professores
app.get('/api/professores', ProfessorController.listProfessores);
app.post('/api/professor', ProfessorController.createProfessor);
app.delete('/api/professor', ProfessorController.deleteProfessor);
app.put('/api/professor', ProfessorController.updateProfessor);
app.get('/api/professores/total', ProfessorController.totalProfessores);
app.get('/api/professor/:codigo', ProfessorController.findProfessor);
app.get('/api/professorName/:codigo', ProfessorController.ProfessorName);

// professores profile images
app.get('/api/image/professor/:codigo_prof', ProfessoresPIMGController.getProfileImage);
app.post('/api/image/professor', ProfessoresPIMGController.createProfileImage);
app.delete('/api/image/professor', ProfessoresPIMGController.deleteProfileImage);
app.put('/api/image/professor', ProfessoresPIMGController.updateProfileImage);

// disciplinas
app.get('/api/disciplinas', DisciplinaController.listDisciplinas);
app.post('/api/disciplina', DisciplinaController.createDisciplina);
app.delete('/api/disciplina', DisciplinaController.deleteDisciplina);
app.put('/api/disciplina', DisciplinaController.updateDisciplina);
app.get('/api/disciplina/:codigo_disci', DisciplinaController.findDisciplina);
app.get('/api/disciplinas/total', DisciplinaController.totalDisciplinas);
app.get('/api/disciplinaMore/:codigo_disci', DisciplinaController.DisciplinaMore);

// matriculado
app.get('/api/matriculas/aluno/:matricula_aluno', MatriculadoController.findMatriculas);
app.post('/api/matricula', MatriculadoController.createMatricula);
app.delete('/api/matricula', MatriculadoController.deleteMatricula);
app.get('/api/matriculas', MatriculadoController.listMatriculas);
app.get('/api/matriculas/disciplina/:codigo_disci', MatriculadoController.findAlunosMatriculados);

// disabled
// app.post('/api/createAlunoMany', AlunoController.createAlunoMany);



app.listen(PORT, () => {
    return console.log(`server is listening on ${PORT}`);
})