const Total = async (serie: string) => {
    var data = null;
    try {
      const response = await fetch(`/api/totalAlunos?serie=${serie}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = Number(await response.json());
      console.log(data);
      return data;
    }catch(e){
      console.error('There has been a problem with totalAlunos Request:', e);
      return;
    } finally {
      console.log(`total alunos for serie ${serie} is ${data}`);
    }
  }

  const Add = async (data: any) => {
    try {
      const response = await fetch('/api/createAluno', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
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
      console.log('aluno added successfully');
    }
  };

  const Alunos = async (page: Number, serie: string) => {
    try {
      console.log(`Requesting page ${page}... serie ${serie}`);
      const response = await fetch(`/api/listAlunos?page=${page}&serie=${serie}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if(data.length === 0){
        console.log('No more data to fetch');
        return [];
      }
      console.log(data);
      return data;
    }catch(e){
      console.error('There has been a problem with your fetch operation:', e);
      return;
    } finally {
      // setIsLoading(false);
      console.log(`Request for series ${serie} page ${page} completed`);
    }
  };

  const Delete = async (matricula: string) => {
    try {
      console.log('ENVIANDO REQUISIÇÃO DE DELEÇÃO...')
      const response = await fetch(`/api/deleteAluno?matricula=${matricula}`, {
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
      const response = await fetch(`/api/updateAluno/${matricula}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
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
      console.log('ALUNO ATUALIZADO.');
    }
  
  }

  const Aluno = async (matricula: string) => {
    try {
      console.log(`Requesting ${matricula} info...`);
      const response = await fetch(`/api/Aluno/${matricula}`);

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
      console.log(`Requesting ${matricula} info...`);
      const response = await fetch(`/api/AlunoMore/${matricula}`);

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

const AlunoInfo = {
    Total,
    Add,
    Alunos,
    Delete,
    Update,
    Aluno,
    AlunoMore
}

export default AlunoInfo;