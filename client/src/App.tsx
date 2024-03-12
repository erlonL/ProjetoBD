import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './App.css';

import ListAlunos from './ListAlunos';
import Button from './components/Button';

Modal.setAppElement('#root');

const _images = require.context('./img', true);
const _imageList = _images.keys().map(_images);

const Images = {
  atualizar: _imageList[0],
  cancelar: _imageList[1],
  lista: _imageList[2],
  lixo: _imageList[3],
  ok: _imageList[4],
  salvar: _imageList[5],
  github: _imageList[6]
}


function App() {
  const modalStyles: Modal.Styles = {
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
      overflowY: 'auto',
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
  };

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
  const [serie, setSerie] = useState(Series[1]['value']);

  const [updNome, setUpdNome] = useState('');
  const [updCpf, setUpdCpf] = useState('');
  const [updSerie, setUpdSerie] = useState('');
  const [updMatricula, setUpdMatricula] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const [totalAlunos, setTotalAlunos] = useState(0);

  const empty = ((Alunos === null) || (Alunos.length === 0) || (Object.keys(Alunos[0]).length === 0)) ? true : false;

  const nextEnabled = (totalAlunos - ((page - 1) * 12)) <= 12;

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
    setSerie(Series[1]['value']);
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

  const handleDeleteAlunoRequest = async (matricula: string) => {
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
    }catch(e){
      console.error('There has been a problem with your fetch operation:', e);
      return;
    } finally {
      console.log('ALUNO DELETADO.');
    }
  
  }

  const handleUpdateAlunoRequest = async (matricula: string, data: any) => {
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
    }catch(e){
      console.error('There has been a problem with your fetch operation:', e);
      return;
    } finally {
      console.log('ALUNO ATUALIZADO.');
    }
  
  }

  useEffect(() => {
    handleRequest();
    setSaveOption(false);
    setShowConfirm(false);
  }, [page, filterSelectedSeries]);


  useEffect(() => {
    handleTotalAlunosRequest(filterSelectedSeries);
  }, [filterSelectedSeries]);

  const [renderOption, setRenderOption] = useState('default');

  const [InfoModalIsOpen, setInfoModalIsOpen] = useState(false);

  const CloseInfoModal = (e: any) => {
    e.stopPropagation();
    setInfoModalIsOpen(false);
  };

  const OpenInfoModal = () => {
    setInfoModalIsOpen(true);
  };

  useEffect(() => {
    if(SaveOption){
      setRenderOption('save');
    } else if(ShowConfirm){
      setRenderOption('delete');
    } else {
      setRenderOption('default');
    }
  }, [SaveOption, ShowConfirm]);

  const [AlunoModalInfo, setAlunoModalInfo] = useState({cpf: '', nome: '', serie: '', matricula: ''});

  useEffect(() => {
    setUpdCpf(AlunoModalInfo['cpf']);
    setUpdNome(AlunoModalInfo['nome']);
    setUpdSerie(AlunoModalInfo['serie']);
    setUpdMatricula(AlunoModalInfo['matricula']);
  }, [AlunoModalInfo]);

  const handleAlunoInfoRequest = async (matricula: string) => {
    try {
      console.log(`Requesting ${matricula} info...`);
      const response = await fetch(`/api/Aluno/${matricula}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setAlunoModalInfo(data);
      console.log(data);
    }catch(e){
      console.error('There has been a problem with your fetch operation:', e);
      return;
    } finally {
      console.log('Request completed');
    }
  }

  const Options: React.FC<{ renderOption: string, aluno: any; }> = ({ renderOption, aluno }) => {
    switch(renderOption)
    {
      case 'delete':
        if(SelectedMatricula === aluno.matricula){
          return <></>;
        }
        return <>{console.log('ERRO EM DELETE')}</>
        break;
        default:
          return <></>;
    }
  }

  return (
    <div className='bg-gradient-to-t bg-[#353535] justify-center items-center h-full w-full flex flex-col'>
      <Modal style={modalStyles}
        isOpen={InfoModalIsOpen}
        onRequestClose={CloseInfoModal}
        contentLabel='EXAMPLE'
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={false}
        >
          <h2 className='text-center font-bold text-3xl top-[0]'>INFORMAÇÕES DO ALUNO</h2>
          <div className='flex flex-col w-[70%] h-[70%]'>
            <label> {updMatricula} </label>
            <form className='flex flex-row'>
              <div className='flex flex-col justify-evenly items-end'>
                <div>
                  <label className='text-xl font-serif'>
                    Nome
                  </label>
                  <input id='input-nome' 
                    value={updNome} 
                    type="text" 
                    placeholder='Ex.: José da Silva'
                    onChange={(e) => setUpdNome(e.target.value)}
                    className='bg-[#25251D] text-[#FFFFFF] p-2 m-2 rounded-lg w-[20vw] font-serif text-lg' 
                  /> 
                </div>

                <div>
                  <label className='text-xl font-serif'>
                    CPF
                  </label>
                  <input id='input-cpf' 
                    value={updCpf}
                    type="text" 
                    placeholder='Ex.: 000.000.000-01'
                    onChange={(e) => setUpdCpf(e.target.value)}
                    className='bg-[#25251D] text-[#FFFFFF] p-2 m-2 rounded-lg w-[20vw] font-serif text-lg' 
                  />
                </div>

                <div>
                  <label className='text-xl font-serif'>
                    Série
                  </label>
                  <select id='input-serie'
                    className='bg-[#25251D] text-[#FFFFFF] p-2 m-2 rounded-lg w-[20vw] font-serif text-lg' 
                    value={updSerie} 
                    onChange={(e) => { setUpdSerie(e.target.value); }}>
                      {Series.slice(1).map((serieObj) => (
                        <option className='text-lg font-serif text-black' key={serieObj['label']} value={serieObj['value']}>
                          {serieObj['label']}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </form>
          </div>
          <div className='flex flex-row justify-evenly'>
          <button className='w-[20vw] bg-[#25251D] text-[#FFFFFF] p-2 m-2 rounded-lg'
            disabled={((isLoading) || (buttonClicked))}
            onClick={(e) => {
              e.preventDefault();
              clearForms();
              CloseInfoModal(e);
            }}>
              Fechar
            </button>
            <button className='w-[20vw] bg-[#25251D] text-[#FFFFFF] p-2 m-2 rounded-lg' 
            disabled={((isLoading) || (buttonClicked))}
            onClick={(e) => {
              e.preventDefault();
              console.log(`Updating alunoInfo ${updMatricula}`);
              const data = { nome: updNome, cpf: updCpf, serie: updSerie};
              console.log(data);
              
              handleUpdateAlunoRequest(updMatricula, data).then(
                () => {
                  handleRequest();
                  handleTotalAlunosRequest(filterSelectedSeries);
                  clearForms();
                  CloseInfoModal(e);
                }
              );
            }}>
              Atualizar
            </button>
          </div>
      </Modal>

      <Modal style={modalStyles}
        isOpen={ModalIsOpen}
        onRequestClose={CloseModal}
        contentLabel='EXAMPLE'
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={false}
        >                
          <h2 className='text-center font-bold text-3xl top-[0]'>ADICIONAR ALUNO</h2>

          <div className='flex flex-col w-[70%] h-[70%]'>
            <label> INFORMAÇÕES </label>
            <form className='flex flex-row'>
              <div className='flex flex-col justify-evenly items-end'>

                <div>
                  <label className='text-xl font-serif'>
                    Nome
                  </label>
                  <input id='input-nome' 
                    value={nome} 
                    type="text" 
                    placeholder='Ex.: José da Silva' 
                    onChange={(e) => setNome(e.target.value)}
                    className='bg-[#25251D] text-[#FFFFFF] p-2 m-2 rounded-lg w-[20vw] font-serif text-lg' />  
                </div>

                <div>
                  <label className='text-xl font-serif'>
                    CPF
                  </label>
                  <input id='input-cpf' 
                    value={cpf}
                    type="text" 
                    placeholder='Ex.: 000.000.000-01'
                    onChange={(e) => setCpf(e.target.value)}
                    className='bg-[#25251D] text-[#FFFFFF] p-2 m-2 rounded-lg w-[20vw] font-serif text-lg' />
                </div>

                <div>
                  <label className='text-xl font-serif'>
                    Série
                  </label>
                  <select id='input-serie'
                    className='bg-[#25251D] text-[#FFFFFF] p-2 m-2 rounded-lg w-[20vw] font-serif text-lg ' 
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
                </div>
              </div>
            </form>
          </div>
          <div className='flex flex-row justify-evenly'>
            <button className='w-[20vw] bg-[#25251D] text-[#FFFFFF] p-2 m-2 rounded-lg'
            disabled={((isLoading) || (buttonClicked))}
            onClick={(e) => {
              e.preventDefault();
              console.log('Closing modal...');
              clearForms();
              CloseModal(e);
            }}>
              Fechar
            </button>
            <button className='w-[20vw] bg-[#25251D] text-[#FFFFFF] p-2 m-2 rounded-lg ' 
            disabled={((isLoading) || (buttonClicked))}
            onClick={(e) => {
              // e.preventDefault();
              console.log('Saving new aluno...');
              const data = { nome, cpf, serie };
              console.log(data);

              handleAddAlunoRequest(data).then(
                () => {
                  handleRequest();
                  handleTotalAlunosRequest(filterSelectedSeries);
                  // CloseModal(e);
                  clearForms();
                }
              );
            }}>
              Salvar
            </button>
          </div>
      </Modal>


      {/* HEADER */}
      <div className='w-screen py-4 h-[20%] justify-center items-center top-0 text-center bg-[#25455B]' id='header'>
        <span className='text-4xl font-bold py-4 text-[#FFFFFF]'>ESCOLA CONCEIÇÃO DA SILVA</span>
      </div>

      {/* TABLE WRAPPER */}
      <div className='flex flex-col justify-center items-center pt-4 my-8 w-[80%] min-h-fit bg-[#D9D9D9]' id='TableWrapper'>
        {/* TABLE HEADER */}
        <div className='py-2 w-full justify-center text-center bg-gradient-to-b from-[#D9D9D9] to-[#D4D4D4]'>
          <h2 className='text-3xl font-serif'>Lista de Alunos</h2>
        </div>

        {/* TABLE */}
        <div className='bg-gradient-to-b from-[#D4D4D4] via-[#CACACA] to-[#C0C0C0] justify-center items-center w-full min-h-fit flex flex-col' id='AlunosTable'>

          {/* TABLE HEADER */}
          <div className='flex flex-row justify-between items-center w-full'>
            {/* TABLE FILTER */}
            <div id='select-label' className='flex flex-col items-start justify-center'>
              <label htmlFor="" className='font-bold font-sans text-xl ml-9'>FILTRO POR SÉRIE</label>
              <select className='bg-[#25251D] text-[#FFFFFF] pl-4 mb-2 rounded-lg w-[16vw] h-[8vh] ml-7 self-start' 
              value={filterSelectedSeries} onChange={handleFilterSeriesChange}>
                {Series.map((serieObj) => (
                  <option key={serieObj['label']} value={serieObj['value']}>
                    {serieObj['label']}
                  </option>
                ))}
              </select>
            </div>
            {/* ADD ALUNO BUTTON */}
            <button className='bg-[#25251D] text-[#FFFFFF] self-end m-2 mr-7 rounded-lg w-[16vw] h-[8vh] ' onClick={OpenModal}>
              <p className='font-bold font-sans'>ADICIONAR ALUNO</p>
            </button>
          </div>
          
          {/* TABLE CONTENT */}
          <div className='flex flex-col w-[95%] bg-gradient-to-br from-[#D9D9D9] to-[#C0C0C0] min-h-[10vh] max-h-[40vh] overflow-y-scroll' id='AlunosWrapper'>
            <table className='border-collapse w-[full]'>
              <thead className='sticky top-[0] z-[1] bg-gradient-to-b from-[#D5D5D5] to-[#D4D4D4] shadow-lg'>
                <tr className='py-4'>
                  <th className='py-4 text-3xl text-center'>Nome</th>
                  <th className='py-4 text-3xl text-center'>Matrícula</th>
                  <th className='py-4 text-3xl text-center'>Série</th>
                  <th className='py-4 text-xl text-center'>OPÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {empty ? (
                  <tr>
                    <td colSpan={3} className='text-base'>Nenhum aluno encontrado</td>
                  </tr>
                ) : (
                  console.log('ALUNOS:', Alunos),
                  Alunos.map((aluno: any) => (
                    <tr className='justify-center items-center' key={aluno.matricula}>
                      <td className='text-base border text-center'>{aluno.nome}</td>
                      <td className='text-base border text-center'>{aluno.matricula}</td>
                      <td className='text-base border text-center'>
                        {Series.filter((serieObj) => serieObj['value'] === aluno.serie)[0]['label']}
                      </td>
                      <td className='flex flex-row w-full h-[12vh] justify-center'>
                        {
                          (renderOption === 'delete') && (SelectedMatricula === aluno.matricula) ? 
                          <>
                            <div className='flex flex-col justify-center items-center'>
                              <label className='text-base font-bold'>Deletar aluno?</label>
                              <div className='flex flex-row justify-center items-center'>
                                <button className='h-[32px] w-[32px] bg-green-400 rounded-3xl mx-1' onClick={() => {
                                  handleDeleteAlunoRequest(aluno.matricula).then(
                                    () => {
                                      handleRequest();
                                      handleTotalAlunosRequest(filterSelectedSeries);
                                      setShowConfirm(!ShowConfirm);
                                    }
                                  );
                                  console.log('Confirmando deleção...');
                                }}>
                                  <img className='w-full h-full' src={Images.ok as string} alt="Confirmar" />
                                </button>                           
                                <button className='h-[32px] w-[32px] bg-red-400 rounded-3xl mx-1' onClick={() => {
                                  setShowConfirm(!ShowConfirm);
                                  console.log('Cancelando deleção...');
                                }}>
                                  <img className='w-full h-full' src={Images.cancelar as string} alt="Cancelar" />
                                </button>
                              </div>
                            </div>
                          </> :

                          <>
                            <div className='flex flex-row mx-4 justify-center items-center'>
                              <button className='bg-[#25251D] text-[#FFFFFF] w-[2vw] h-[4vh] mx-1 my-2 rounded-lg' onClick={() => {
                                handleAlunoInfoRequest(aluno.matricula).then(
                                  () => {
                                    OpenInfoModal();
                                  }
                                )
                              }}>
                                <img className='w-full h-full filter invert' src={Images.lista as string} alt="info" />
                              </button>
                              <button className='bg-[#25251D] text-[#FFFFFF] w-[2vw] h-[4vh] p-1 mx-1 my-2 rounded-lg' onClick={() => {
                                setSelectedMatricula(aluno.matricula);
                                setSaveOption(false);
                                setShowConfirm(true);
                                console.log('Deletando aluno...');
                              }} >
                                <img className='w-full h-full filter invert' src={Images.lixo as string} alt="delete" />
                              </button>
                            </div>
                          </>
                        }
                        <Options renderOption={renderOption} aluno={aluno} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* TABLE FOOTER */}
          <div className='flex flex-row justify-center w-full bg-gradient-to-b from-[#C0C0C0] to-[#AEAEAE]'>
            <div className='flex flex-col justify-center items-start m-4'>
              <span className='text-center ml-2'>
                <p className=' text-sm font-bold font-serif'>Página: {page}</p>
              </span>
              <span className='text-center ml-2'>
                <p className='text-sm font-bold font-serif'>{Object.keys(Alunos[0]).length === 0 ? 0 : Alunos.length} / {page === 1 ? totalAlunos : totalAlunos - ((page - 1) * 12)} </p>
              </span>
            </div>

            <div className='ml-auto flex flex-row items-center justify-center'>
              <div className='p-2'>
                <button className='bg-[#25251D] text-[#FFFFFF] m-1 p-1 rounded-lg w-[2.5vw] h-[5vh]'
                onClick={() => {
                  setAlunos([{}]);
                  handleRequest();
                  setShowConfirm(false);
                  setSaveOption(false);
                  clearForms();
                  console.log('ATUALIZANDO TABELA...')
                }}>
                  <img className='w-full h-full filter invert' src={Images.atualizar as string} alt="Atualizar"/>
                </button>
              </div>

              <div>
                <button id='PREVIOUS-BTN' className='bg-[#25251D] text-[#FFFFFF] p-2 m-4 rounded-lg w-[8vw] h-[6vh]' disabled={page === 1} onClick={() => {
                  handlePreviousPageRequest();
                }}>
                  Anterior
                </button>
                <button id='NEXT-BTN' className='bg-[#25251D] text-[#FFFFFF] p-2 m-4 rounded-lg w-[8vw] h-[6vh]' disabled={nextEnabled} onClick={() => {
                  handleNextPageRequest();
                }}>
                  Próxima
                </button>
              </div>
            
            </div>
          </div>

          {/* <div className='justify-center items-center bg-red-500 w-full flex flex-row'>
              <Button className='bg-[#25251D] text-[#FFFFFF] p-2 m-2 rounded-lg' onClick={() => {
              }}>Anterior</button>
              <Button className='bg-[#25251D] text-[#FFFFFF] p-2 m-2 rounded-lg' disabled={nextEnabled} onClick={() => {
              }}>Próxima</button>
          </div> */}
        </div>
      </div>
      
      {/* FOOTER */}
      <footer className='bg-[#284B63] w-full shadow-[0_50vh_0_50vh_#284B63] justify-center flex' id='footer'>
        <div className='w-[12vw] h-[8vh] flex justify-center items-center bg-slate-600 rounded-3xl z-10'>
          {/* <span className='text-4xl font-bold py-4 justify-center items-center flex flex-col'> */}
          <div className='w-[140px] h-[50px] justify-center items-center flex bg-[#25251D] text-[#FFFFFF] rounded-3xl z-10'>
            <a href="https://github.com/erlonl/"
            className='flex flex-row justify-center items-center w-full h-full rounded-3xl'>
              <img 
              src={Images.github as string} 
              alt="github logo"
              className='w-full h-full filter invert object-contain'
              />
              <span className='font-mono text-base -ml-4 pl-6 pr-6 py-2 rounded-r-3xl'>erlonl</span>
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
