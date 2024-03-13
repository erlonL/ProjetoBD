import express from 'express';
import AlunoController from './controllers/AlunoController';

const app = express();
app.use(express.json());
const PORT = 8000;

app.get('/api', (request, response) => {
    response.send('Hello World');
});

app.post('/api/createAluno', AlunoController.createAluno);

app.get('/api/listAlunos', AlunoController.listAlunos);

app.get('/api/Aluno/:matricula', AlunoController.findAluno);

app.put('/api/updateAluno/:matricula', AlunoController.updateAluno);

app.delete('/api/deleteAluno', AlunoController.deleteAluno);

app.get('/api/totalAlunos', AlunoController.totalAlunos);

app.get('/api/getColumns', AlunoController.getColumns);

// app.post('/api/createAlunoMany', AlunoController.createAlunoMany);

app.listen(PORT, () => {
    return console.log(`server is listening on ${PORT}`);
})