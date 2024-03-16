import express from 'express';
import AlunoController from './controllers/AlunoController';
import PIMGController from './controllers/ProfileImagesController';

const app = express();
app.use(express.json());
const PORT = 8000;

app.get('/api', (request, response) => {
    response.send('Hello World');
});

// alunos
app.post('/api/createAluno', AlunoController.createAluno);

app.get('/api/listAlunos', AlunoController.listAlunos);

app.get('/api/Aluno/:matricula', AlunoController.findAluno);

app.put('/api/updateAluno/:matricula', AlunoController.updateAluno);

app.delete('/api/deleteAluno', AlunoController.deleteAluno);

app.get('/api/totalAlunos', AlunoController.totalAlunos);

app.get('/api/getAlunoColumns', AlunoController.getColumns);


// images
app.get('/api/image/:matricula', PIMGController.getProfileImage);

app.post('/api/createImage', PIMGController.createProfileImage);

app.delete('/api/deleteImage', PIMGController.deleteProfileImage);

app.put('/api/updateImage', PIMGController.updateProfileImage);


// app.post('/api/createAlunoMany', AlunoController.createAlunoMany);

app.listen(PORT, () => {
    return console.log(`server is listening on ${PORT}`);
})