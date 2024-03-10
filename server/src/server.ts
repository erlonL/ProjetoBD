import express from 'express';
const bodyParser = require('body-parser');
import AlunoController from './controllers/AlunoController';

const app = express();
// app.use(express.json());

const PORT = 8000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/api', (request, response) => {
    response.send('Hello World');
});

app.post('/api/createAluno', AlunoController.createAluno);

app.get('/api/listAlunos', AlunoController.listAlunos);

app.get('/api/Aluno/:matricula', AlunoController.findAluno);

app.put('/api/updateAluno/:matricula', AlunoController.updateAluno);

app.delete('/api/deleteAluno', AlunoController.deleteAluno);

app.get('/api/totalAlunos', AlunoController.totalAlunos);

app.listen(PORT, () => {
    console.log('Server is running on port PORT');
});