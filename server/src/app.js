import express from 'express';
import AlunoController from './controllers/AlunoController.js';
import PIMGController from './controllers/ProfileImagesController.js';

const app = express();
app.use(express.json());
const PORT = 8000;

app.get('/api', (request, response) => {
    response.send('Hello World');
});

// alunos
app.get('/api/listAlunos', AlunoController.listAlunos);
app.post('/api/createAluno', AlunoController.createAluno);
app.get('/api/totalAlunos', AlunoController.totalAlunos);
app.delete('/api/deleteAluno', AlunoController.deleteAluno);
app.put('/api/updateAluno/:matricula', AlunoController.updateAluno);
app.get('/api/Aluno/:matricula', AlunoController.findAluno);
app.get('/api/AlunoMore/:matricula', AlunoController.findAlunoMore);

// profile images
app.get('/api/image/:matricula', PIMGController.getProfileImage);
app.post('/api/createImage', PIMGController.createProfileImage);
app.delete('/api/deleteImage', PIMGController.deleteProfileImage);
app.put('/api/updateImage', PIMGController.updateProfileImage);

// disabled
// app.post('/api/createAlunoMany', AlunoController.createAlunoMany);



app.listen(PORT, () => {
    return console.log(`server is listening on ${PORT}`);
})