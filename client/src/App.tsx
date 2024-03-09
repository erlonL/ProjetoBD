import React, { useEffect, useState } from 'react';
import './App.css';

import ListAlunos from './ListAlunos';

function App() {
  // const url = window.location.href;
  // const RequestPage = parseInt(url.substring(url.indexOf('page=') + 5, url.length));
  // const RequestPage = 1;

  const handleRequest = async () => {
    try {
      const response = await fetch(`/api/listAlunos?page=${page}&serie=${selectedSeries}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if(data.length === 0){
        console.log('No more data to fetch');
        setAlunos([{}]);
        return;
      }
      setAlunos(data);
      
    }catch(e){
      console.error('There has been a problem with your fetch operation:', e);
      return;
    } finally {
      console.log('Request completed');
    }
  }


  const [Alunos, setAlunos] = useState([{}]);

  const Series = [
    { value: 'ALL', label: 'Todos' },
    { value: 'F1', label: 'Fundamental I' },
    { value: 'F2', label: 'Fundamental II' },
    { value: 'F3', label: 'Fundamental III' },
    { value: 'F4', label: 'Fundamental IV' },
    { value: 'F5', label: 'Fundamental V' },
    { value: 'F6', label: 'Fundamental VI' },
    { value: 'F7', label: 'Fundamental VII' },
    { value: 'F8', label: 'Fundamental VIII' },
    { value: 'F9', label: 'Fundamental IX' },
    { value: 'M1', label: 'Médio I' },
    { value: 'M2', label: 'Médio II' },
    { value: 'M3', label: 'Médio III' }
  ]

  const [selectedSeries, setSelectedSeries] = useState(Series[0]['value']);

  const handleSeriesChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSeries(event.target.value);
    setPage(1);
  };

  const DEFAULTPAGE = 1;

  const [page, setPage] = useState(DEFAULTPAGE);

  // const handleSelectPageChange = () => {
  //   setPage(1);
  // }

  const handleNextPageRequest = () => {
    setPage(page + 1);
  }

  const handlePreviousPageRequest = () => {
    if(page > 1){
      setPage(page - 1);
    }
  }

  useEffect(() => {
    handleRequest();
  }, [page, selectedSeries]);

  const [SaveOption, setSaveOption] = useState(false);

  const [Editable, setEditable] = useState(false);

  const [ShowConfirm, setShowConfirm] = useState(false);

  const [SelectedMatricula, setSelectedMatricula] = useState('');

  const handleRowClick = (matricula: string) => {
    setSelectedMatricula(matricula);
    setSaveOption(true);
  }

  const empty = ((Alunos === null) || (Alunos.length === 1)) ? true : false;

  const nextEnabled = Alunos.length < 12;

  return (
    <div className='bg-gradient-to-br from-purple-600 to-blue-600 h-screen w-screen flex-col'>
      <div className='flex w-screen h-20 justify-center bg-slate-50 top-0' id='header'>
        <span className='text-4xl font-bold py-4'>ESCOLA CONCEIÇÃO DA SILVA</span>
      </div>

      <div className='flex flex-col justify-center items-center w-full' id='TableWrapper'>
        <div className='pb-4 pt-4 w-full justify-center text-center'>
          <h2 className='text-3xl font-serif'>Lista de Alunos</h2>
        </div>

        <div className='bg-yellow-500 justify-center items-center w-[72vw] h-[72vh] mb-[10vh] flex flex-col' id='AlunosTable'>

          <div className='flex w-full'>
            <div id='select-label' className='flex-col justify-center items-center'>
              <label htmlFor="" className='pl-3 font-bold font-sans text-xl'>FILTRO POR SÉRIE</label>
                <select className='bg-slate-200 p-4 m-2 rounded-lg w-[16vw] h-[8vh] ml-4 self-start' 
                value={selectedSeries} onChange={handleSeriesChange}>
                  {Series.map((serieObj) => (
                    <option key={serieObj['label']} value={serieObj['value']}>
                      {serieObj['label']}
                    </option>
                  ))}
                </select>
            </div>
            <button className='bg-slate-200 p-2 m-2 rounded-lg w-[16vw] h-[8vh] ml-auto' onClick={() => {
              handleRequest();
            }}>
              APLICAR
            </button>
          </div>

          <div className='flex flex-col justify-between h-3/4 w-[90%] bg-slate-400 overflow-scroll overflow-x-hidden' id='AlunosWrapper'>
            <table>
              <thead>
                <tr>
                  <th className='text-3xl border text-center'>Nome</th>
                  <th className='text-3xl border text-center'>Matrícula</th>
                  <th className='text-3xl border text-center'>Série</th>
                  <th className='text-xl border text-center'>OPÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {empty ? (
                  <tr>
                    <td colSpan={3} className='text-base'>Nenhum aluno encontrado</td>
                  </tr>
                ) : (
                  Alunos.map((aluno: any) => (
                    <tr key={aluno.matricula}>
                      <td onClick={() => handleRowClick(aluno.matricula)} contentEditable="true" className='text-base border text-center'>{aluno.nome}</td>
                      <td onClick={() => handleRowClick(aluno.matricula)} contentEditable="true" className='text-base border text-center'>{aluno.matricula}</td>
                      <td onClick={() => handleRowClick(aluno.matricula)} contentEditable="true" className='text-base border text-center'>{aluno.serie}</td>
                      <td className='flex flex-row w-[10vw] justify-center'>
                        {
                          SaveOption && SelectedMatricula === aluno.matricula ? (
                            <button className='bg-slate-200 p-2 m-2 rounded-lg' onClick={() => {
                              setSaveOption(false);
                              console.log('Salvando alterações...');
                            }}>Salvar</button>
                          ) : (
                            <>
                            <button className='bg-slate-200 p-2 m-2 rounded-lg' onClick={() => {
                              console.log('Visualizando aluno...');
                            }}>Informações</button>
                            <button className='bg-slate-200 p-2 m-2 rounded-lg' onClick={() => {
                              setShowConfirm(true);
                              console.log('Deletando aluno...');
                            }}>Deletar</button>
                            </>
                          )
                        }

                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className='flex flex-row w-full'>
            <span className='text-center justify-center mt-4 ml-2'>
              <p className=' text-sm font-bold font-serif'>Page: {page}</p>
            </span>
            
            <div className='ml-auto'>
              <button id='PREVIOUS-BTN' className='bg-slate-200 p-2 m-2 rounded-lg' disabled={page === 1} onClick={() => {
                handlePreviousPageRequest();
                
                // page > 1 ? setPage(page - 1) : null;
              }}>
                Anterior
              </button>
              <button id='NEXT-BTN' className='bg-slate-200 p-2 m-2 rounded-lg' disabled={nextEnabled} onClick={() => {
                handleNextPageRequest();
              }}>
                Próxima
              </button>
            </div>
          </div>

          {/* <div className='justify-center items-center bg-red-500 w-full flex flex-row'>
              <button className='bg-slate-200 p-2 m-2 rounded-lg' onClick={() => {
              }}>Anterior</button>
              <button className='bg-slate-200 p-2 m-2 rounded-lg' disabled={nextEnabled} onClick={() => {
              }}>Próxima</button>
          </div> */}
        </div>
      </div>
      
      <div className='flex w-screen h-20 justify-center bg-slate-50' id='footer'>
        <span className='text-4xl font-bold py-4'></span>
      </div>
    </div>

  );
}

export default App;
