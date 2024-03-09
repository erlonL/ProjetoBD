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

app.get('/api/findAluno/:matricula', AlunoController.findAluno);

app.put('/api/updateAluno/:matricula', AlunoController.updateAluno);

app.delete('/api/deleteAluno/:id', AlunoController.deleteAluno);

app.delete('/api/deleteAlunobymatricula/:matricula', AlunoController.deleteAlunoByMatricula);

app.get('/api/totalAlunos', AlunoController.totalAlunos);

// app.post('/api/createAlunoMany', AlunoController.createAlunoMany);

app.listen(PORT, () => {
    return console.log(`server is listening on ${PORT}`);
})