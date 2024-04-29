const Disciplinas = async (page: Number) => {
  try{
    const response = await fetch(`/api/disciplinas?page=${page}`);
    if(!response.ok){
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log(data);
    if(data.length === 0){
      console.log('No more data to fetch');
      return [{}];
    }
    return data;
  } catch(error){
    console.error('There has been a problem with your fetch operation:', error);
    return;
  }
}

const Delete = async (codigo: string) => {
  try{
    console.log('ENVIANDO REQUISIÇÃO DE DELEÇÃO...')
    const response = await fetch(`/api/disciplina?codigo=${codigo}`, {
      method: 'DELETE'
    });
    if(!response.ok){
      throw new Error('Network response was not ok');
    }
    const responseJSON = await response.json();
    console.log(responseJSON);
    return responseJSON;
  } catch(error){
    console.error('There has been a problem with your fetch operation:', error);
    return;
  }
}

const Update = async (codigo: string, data: any) => {
  try{
    console.log('ENVIANDO REQUISIÇÃO DE ATUALIZAÇÃO...')
    const response = await fetch(`/api/disciplina?codigo=${codigo}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if(!response.ok){
      throw new Error('Network response was not ok');
    }
    const responseJSON = await response.json();
    console.log(responseJSON);
    return responseJSON;
  } catch(error){
    console.error('There has been a problem with your fetch operation:', error);
    return;
  }
}

const Create = async (data: any) => {
  try{
    console.log('ENVIANDO REQUISIÇÃO DE CRIAÇÃO...')
    const response = await fetch(`/api/disciplina`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if(!response.ok){
      throw new Error('Network response was not ok');
    }
    const responseJSON = await response.json();
    console.log(responseJSON);
    return responseJSON;
  } catch(error){
    console.error('There has been a problem with your fetch operation:', error);
    return;
  }
}

const Disciplina = async (codigo: string) => {
  try{
    const response = await fetch(`/api/disciplina/${codigo}`);
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

const DisciplinaMore = async (codigo: string) => {
  try{
    const response = await fetch(`/api/disciplinaMore/${codigo}`);
    if(!response.ok){
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch(e){
    console.error('There has been a problem with your fetch operation:', e);
    return;
  }
}

const Total = async () => {
  try{
    const response = await fetch(`/api/disciplinas/total`);
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

const DisciplinaInfo = {
  Disciplinas,
  Delete,
  Update,
  Create,
  Disciplina,
  DisciplinaMore,
  Total
}

export default DisciplinaInfo;