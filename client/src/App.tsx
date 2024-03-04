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
    <div className='bg-gradient-to-br from-purple-600 to-blue-600 h-screen w-screen overflow-hidden'>
      <div className='flex justify-center top-5 w-auto bg-slate-50'>
        <span className='font-sans text-4xl font-bold py-4'>ESCOLA CONCEIÇÃO DA SILVA</span>
      </div>

      <div className='flex flex-row items-center justify-between my-44'>
          <div key={'listAlunos'} className='flex items-center mx-5 bg-white cursor-pointer select-none h-16 rounded-3xl'>
            <p className='text-base mx-4'>LISTAR ALUNOS</p>
          </div>

        {[
          ['addAluno', 'ADICIONAR ALUNO'],
          ['updAluno', 'ATUALIZAR ALUNO'],
          ['rmvAluno', 'REMOVER ALUNO'],

        ].map(([key, text]) => (
          <div key={key} className='flex items-center mx-5 bg-white cursor-pointer select-none h-16 rounded-3xl'>
            <p className='text-base mx-4'>{text}</p>
          </div>
        ) )
        }

      </div>
    </div>
  );
}

export default App;
