import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './App.css';

import ListAlunos from './ListAlunos';
import Button from './components/Button';

Modal.setAppElement('#root');

function App() {

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

  const [Alunos, setAlunos] = useState([{}]);
  const [filterSelectedSeries, setFilterSelectedSeries] = useState(Series[0]['value']);
  const [addAlunoSelectedSerie, setAddAlunoSelectedSerie] = useState(Series[1]['value']);

  const DEFAULTPAGE = 1;
  const [page, setPage] = useState(DEFAULTPAGE);

  const [SaveOption, setSaveOption] = useState(false);
  const [Editable, setEditable] = useState(false);
  const [ShowConfirm, setShowConfirm] = useState(false);
  const [SelectedMatricula, setSelectedMatricula] = useState('');
  const [ModalIsOpen, setModalIsOpen] = useState(false);

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [serie, setSerie] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const [totalAlunos, setTotalAlunos] = useState(0);

  const empty = ((Alunos === null) || (Alunos.length === 0) || (Object.keys(Alunos[0]).length === 0)) ? true : false;

  const nextEnabled = Alunos.length < 12;

  const handleTotalAlunosRequest = async (serie: string) => {
    try {
      const response = await fetch(`/api/totalAlunos?serie=${serie}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = Number(await response.json());
      setTotalAlunos(data);
      console.log(data);
    }catch(e){
      console.error('There has been a problem with totalAlunos Request:', e);
      return;
    } finally {
      console.log('Request completed');
    }
  }

  const clearForms = () => {
    setNome('');
    setCpf('');
    setSerie('');
  };

  const handleAddAlunoRequest = async (data: any) => {
    try {
      setIsLoading(true);
      setButtonClicked(true);
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
    }catch(e){
      console.error('There has been a problem with your fetch operation:', e);
      return;
    } finally {
      console.log('Request completed');
      clearForms();
      setIsLoading(false);
      setButtonClicked(false);
    }
  };

  const handleRequest = async () => {
    try {
      console.log(`Requesting page ${page}... serie ${filterSelectedSeries}`);
      const response = await fetch(`/api/listAlunos?page=${page}&serie=${filterSelectedSeries}`);
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
  };

  const handleFilterSeriesChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterSelectedSeries(event.target.value);
    setPage(1);
  };

  const handleAddAlunoSeriesChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAddAlunoSelectedSerie(event.target.value);
    setSerie(event.target.value);
  };

  const handleNextPageRequest = () => {
    setPage(page + 1);
  };

  const handlePreviousPageRequest = () => {
    if(page > 1){
      setPage(page - 1);
    }
  };

  const OpenModal = () => {
    setModalIsOpen(true);
  };

  const CloseModal = (e: any) => {
    e.stopPropagation();
    setModalIsOpen(false);
  };

  useEffect(() => {
    handleRequest();
  }, [page, filterSelectedSeries]);

  useEffect(() => {
    handleTotalAlunosRequest(filterSelectedSeries);
  }, [filterSelectedSeries]);

  const handleRowClick = (matricula: string) => {
    setSelectedMatricula(matricula);
    setSaveOption(true);
    setShowConfirm(false);
    // setEnableOtherRowsEdit(false);
  }

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
                value={filterSelectedSeries} onChange={handleFilterSeriesChange}>
                  {Series.map((serieObj) => (
                    <option key={serieObj['label']} value={serieObj['value']}>
                      {serieObj['label']}
                    </option>
                  ))}
                </select>
            </div>
            <button className='bg-slate-200 p-2 m-2 rounded-lg w-[4vw] h-[8vh] ml-auto'>
              UPDT
            </button>
            <button className='bg-slate-200 p-2 m-2 rounded-lg w-[16vw] h-[8vh] ml-auto' onClick={OpenModal}>
              <p className='font-bold font-sans'>ADICIONAR ALUNO</p>
              <Modal style={{
                overlay: {
                  backgroundColor: 'rgba(0, 0, 0, 0)',
                  zIndex: '99999',
                  display: 'flex',
                  justifyContent: 'center',
                  position: 'fixed',
                  top: '0',
                  left: '0',
                  width: '100vw',
                  height: '100vh',
                  overflowY: 'auto'
                },
                content: {
                  top: '50%',
                  left: '50%',
                  right: 'auto',
                  bottom: 'auto',
                  marginRight: '-50%',
                  transform: 'translate(-50%, -50%)',
                  // background: 'linear-gradient(180deg, rgba(163, 230, 53, 1), rgba(168, 85, 247, 0.7))',
                  background: 'linear-gradient(120deg, rgba(71, 85, 105, 1), rgba(177,177,177, 1))',
                  // backgroundColor: 'rgba(71, 85, 105, 1)',
                  zIndex: '99999',
                  color: 'white',
                  border: '3px solid #000',
                  borderRadius: '10px',
                  width: '50%',
                  height: '50%',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                }
              }}
              isOpen={ModalIsOpen}
              onRequestClose={CloseModal}
              contentLabel='EXAMPLE'
              shouldCloseOnEsc={true}
              shouldCloseOnOverlayClick={false}
              >                
                <h2 className='text-center font-bold text-3xl top-[0]'>ADICIONAR ALUNO</h2>

                <div className='flex flex-col w-[70%] h-[70%]'>
                  <label> FORMS </label>
                  <form className='flex flex-row'>
                    <div className='flex flex-col justify-evenly space-y-4 items-end'>
                      <label className='text-xl font-serif'>
                        Nome:
                      </label>
                      <label className='text-xl font-serif'>
                        CPF:
                      </label>
                      <label className='text-xl font-serif'>
                        Série:
                      </label>
                    </div>
                    <div className='flex flex-col items-start'>
                      <input id='input-nome' 
                      value={nome} 
                      type="text" 
                      placeholder='Ex.: José da Silva' 
                      onChange={(e) => setNome(e.target.value)}
                      className='bg-slate-200 p-2 m-2 rounded-lg w-[20vw] text-black font-serif text-lg' />  

                      <input id='input-cpf' 
                      value={cpf}
                      type="text" 
                      placeholder='Ex.: 000.000.000-01'
                      onChange={(e) => setCpf(e.target.value)}
                      className='bg-slate-200 p-2 m-2 rounded-lg w-[20vw] text-black font-serif text-lg' />

                      <select id='input-serie'

                      className='bg-slate-200 p-2 m-2 rounded-lg w-[20vw] font-serif text-lg text-black' 
                      value={serie} 
                      onChange={(e) => {
                        setSerie(e.target.value);
                      }}>
                          {Series.slice(1).map((serieObj) => (
                            <option className='text-lg font-serif text-black' key={serieObj['label']} value={serieObj['value']}>
                              {serieObj['label']}
                            </option>
                          ))}
                      </select>
                      {/* <input type="text" placeholder='' className='bg-slate-200 p-2 m-2 rounded-lg text-black' /> */}
                    </div>
                  </form>
                </div>
                <div className='flex flex-row justify-evenly'>
                  <button className='w-[20vw] bg-slate-200 p-2 m-2 rounded-lg text-black'
                  disabled={((isLoading) || (buttonClicked))}
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('Closing modal...');
                    clearForms();
                    CloseModal(e);
                  }}>
                    Close
                  </button>
                  <button className='w-[20vw] bg-slate-200 p-2 m-2 rounded-lg text-black' 
                  disabled={((isLoading) || (buttonClicked))}
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('Saving new aluno...');
                    const data = { nome, cpf, serie };
                    console.log(data);

                    handleAddAlunoRequest(data);
                    clearForms();
                  }}>
                    Save
                  </button>
                </div>
              </Modal>
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
                    <tr className='justify-center items-center' key={aluno.matricula}>
                      <td onClick={() => handleRowClick(aluno.matricula)} contentEditable="true" className='text-base border text-center'>{aluno.nome}</td>
                      <td onClick={() => handleRowClick(aluno.matricula)} contentEditable="true" className='text-base border text-center'>{aluno.matricula}</td>
                      <td onClick={() => handleRowClick(aluno.matricula)} contentEditable="true" className='text-base border text-center'>{aluno.serie}</td>
                      <td className='flex flex-row w-full h-[12vh] justify-center'>
                        {
                          ShowConfirm && SelectedMatricula === aluno.matricula? (
                            <div className='flex flex-col justify-center items-center'>
                              <label className='text-base font-bold'>Deletar aluno?</label>
                              <div className='flex flex-row justify-center items-center'>
                                <button className='h-[32px] w-[32px] bg-green-400 rounded-3xl mx-1' onClick={() => {
                                  setShowConfirm(!ShowConfirm);
                                  console.log('Confirmando deleção...');
                                }}>
                                  <img className='w-full h-full' src={require('./img/ok.png')} alt="Confirmar" />
                                </button>                           
                                <button className='h-[32px] w-[32px] bg-red-400 rounded-3xl mx-1' onClick={() => {
                                  setShowConfirm(!ShowConfirm);
                                  console.log('Cancelando deleção...');
                                }}>
                                  <img className='w-full h-full' src={require('./img/cancelar.png')} alt="Cancelar" />
                                </button>
                              </div>
                            </div>
                          ) :
                          SaveOption && SelectedMatricula === aluno.matricula ? (
                            <div className='flex flex-col justify-center items-center'>
                              <label className='text-base font-bold'>Salvar alterações?</label>
                              <div className='flex flex-row justify-center items-center'>
                                <button className='h-[32px] w-[32px] bg-slate-200 rounded-lg mx-1' onClick={() => {
                                  setSaveOption(!SaveOption);
                                  // setEnableOtherRowsEdit(true);
                                  console.log('Salvando alterações...');
                                }}>
                                  <img className='w-full h-full' src={require('./img/salvar.png')} alt="salvar" />
                                </button>
                                <button className='h-[32px] w-[32px] bg-slate-200 rounded-3xl mx-1' onClick={() => {
                                  setSaveOption(!SaveOption);
                                  // setEnableOtherRowsEdit(true);
                                  console.log('Cancelando alterações...');
                                }}>
                                  <img className='w-full h-full' src={require('./img/cancelar.png')} alt="cancelar" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className='flex flex-row mx-4 justify-center items-center'>
                              <button className='bg-slate-200 w-[2vw] h-[4vh] mx-1 my-2 rounded-lg' onClick={() => {
                                console.log('Visualizando aluno...');
                              }}>
                                <img className='w-full h-full' src={require('./img/lista.png')} alt="info" />
                              </button>
                              <button className='bg-slate-200 w-[2vw] h-[4vh] mx-1 my-2 rounded-lg' onClick={() => {
                                setShowConfirm(!ShowConfirm);
                                console.log('Deletando aluno...');
                              }} >
                                <img className='w-full h-full' src={require('./img/lixo.png')} alt="delete" />
                              </button>
                            </div>
                          )
                        }
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className='flex flex-row justify-center w-full'>
            <div className='flex flex-col justify-center items-start ml-2'>
              <span className='text-center mt-4 ml-2'>
                <p className=' text-sm font-bold font-serif'>Page: {page}</p>
              </span>
              <span className='text-center ml-2'>
                <p className='text-sm font-bold font-serif'>Viewing: {Object.keys(Alunos[0]).length === 0 ? 0 : Alunos.length} / {page === 1 ? totalAlunos : totalAlunos - ((page - 1) * 12)} </p>
              </span>
            </div>
            
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
              <Button className='bg-slate-200 p-2 m-2 rounded-lg' onClick={() => {
              }}>Anterior</button>
              <Button className='bg-slate-200 p-2 m-2 rounded-lg' disabled={nextEnabled} onClick={() => {
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
