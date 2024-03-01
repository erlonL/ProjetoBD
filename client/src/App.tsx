import React, { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [Alunos, setAlunos] = useState([{}])

  useEffect(() => {
    fetch('/api/listAlunos').then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      setAlunos(data);
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
  }, []);

  return (
    <div className="App">

      {(typeof Alunos === 'undefined' || Alunos.length === 0) ? (
        <p>Carregando... </p>
      ): (
        <ul>
          {Alunos.map((Aluno: any) => {
            return <li key={Aluno.id}>{Aluno.nome} - {Aluno.matricula}</li>
          })}
        </ul>
      )
    }

    </div>
  );
}

export default App;
