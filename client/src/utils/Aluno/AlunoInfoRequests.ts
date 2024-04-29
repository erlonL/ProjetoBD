const Total = async (turma: string) => {
    var data = null;
    try {
      const response = await fetch(`/api/alunos/total?turma=${turma}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      data = Number(await response.json());
      return data;
    }catch(e){
      console.error('There has been a problem with totalAlunos Request:', e);
      return;
    } finally {
      console.log(`Total de alunos na série ${turma}: ${data}`);
    }
  }

  const Create = async (data: any) => {
    try {
      const response = await fetch('/api/aluno', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const responseJSON = await response.json();
      console.log(responseJSON);
      return responseJSON;
    }catch(e){
      console.error('There has been a problem with your fetch operation:', e);
      return;
    } finally {
      console.log('aluno added successfully');
    }
  };

  const Alunos = async (page: Number, turma: string) => {
    try {
      //console.log(`Requesting page ${page}... turma ${turma}`);
      const response = await fetch(`/api/alunos?page=${page}&turma=${turma}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      if(data.length === 0){
        console.log('No more data to fetch');
        return [{}];
      }
      //console.log(data);
      return data;
    }catch(e){
      console.error('There has been a problem with your fetch operation:', e);
      return;
    } finally {
      // setIsLoading(false);
      //console.log(`Request for turmas ${turma} page ${page} completed`);
    }
  };

  const Delete = async (matricula: string) => {
    try {
      console.log('ENVIANDO REQUISIÇÃO DE DELEÇÃO...')
      const response = await fetch(`/api/aluno?matricula=${matricula}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const responseJSON = await response.json();
      console.log(responseJSON);
      return responseJSON;
    }catch(e){
      console.error('There has been a problem with your fetch operation:', e);
      return;
    } finally {
      console.log('ALUNO DELETADO.');
    }
  
  }

  const Update = async (matricula: string, data: any) => {
    try {
      console.log('ENVIANDO REQUISIÇÃO DE ATUALIZAÇÃO...')
      const response = await fetch(`/api/aluno?matricula=${matricula}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const responseJSON = await response.json();
      console.log(responseJSON);
    }catch(e){
      console.error('There has been a problem with your fetch operation:', e);
      return;
    } finally {
      console.log('ALUNO ATUALIZADO.');
    }
  
  }

  const Aluno = async (matricula: string) => {
    try {
      //console.log(`Requesting ${matricula} info...`);
      const response = await fetch(`/api/aluno/${matricula}`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const infoData = await response.json();
      console.log(infoData);
      return infoData;
    }catch(e){
      console.error('There has been a problem with your fetch operation:', e);
      return;
    } finally {
      console.log('Aluno Info Request Succesfully');
    }
  }
  const AlunoMore = async (matricula: string) => {
    try {
      const response = await fetch(`/api/alunoMore/${matricula}`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      return data;
    }catch(e){
      console.error('There has been a problem with your fetch operation:', e);
      return;
    }
  }

const AlunoInfo = {
    Total,
    Create,
    Alunos,
    Delete,
    Update,
    Aluno,
    AlunoMore
}

export default AlunoInfo;