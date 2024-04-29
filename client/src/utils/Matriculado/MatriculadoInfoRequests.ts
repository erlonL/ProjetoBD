const Matriculados = async (codigo_disciplina: string) => {
    try{
        const response = await fetch(`/api/matriculas/disciplina/${codigo_disciplina}`);
        if(!response.ok){
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch(error){
        console.error('There has been a problem with your fetch operation:', error);
        return;
    }
}

const alunoMatriculas = async (matricula_aluno: string) => {
    try{
        const response = await fetch(`/api/matriculas/aluno/${matricula_aluno}`);
        if(!response.ok){
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch(error){
        console.error('There has been a problem with your fetch operation:', error);
        return;
    }   
}

const MatriculadoInfo = {
    Matriculados,
    alunoMatriculas
}

export default MatriculadoInfo;