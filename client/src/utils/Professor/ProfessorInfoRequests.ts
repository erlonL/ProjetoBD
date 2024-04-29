const ProfessorMore = async (codigo: string) => {
  try{
    const response = await fetch(`/api/professorMore/${codigo}`);
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

const Professor = async (codigo: string) => {
  try{
    const response = await fetch(`/api/professor/${codigo}`);
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

const ProfessorName = async (codigo: string) => {
  try{
    const response = await fetch(`/api/professorName/${codigo}`);
    if(!response.ok){
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    //console.log(data);
    return data;
  } catch(e){
    console.error('There has been a problem with your fetch operation:', e);
    return;
  }
}

const ProfessorInfo = {
  Professor,
  ProfessorMore,
  ProfessorName
}

export default ProfessorInfo;