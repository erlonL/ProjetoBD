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

interface AlunoInfo {
  nome: string;
  cpf: string;
  serie: string;
  matricula: string;
  imgURL: string;
}


function App() {

  const modalStyles: Modal.Styles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0)',
      zIndex: '9999',
      justifyContent: 'center',
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
    },
    // transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
    // transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    // transition-duration: 150ms;
    content: {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      // background: 'linear-gradient(180deg, rgba(163, 230, 53, 1), rgba(168, 85, 247, 0.7))',
      background: 'linear-gradient(120deg, rgba(71, 85, 105, 1), rgba(177,177,177, 1))',
      // backgroundColor: 'rgba(71, 85, 105, 1)',
      zIndex: '99999',
      color: 'white',
      border: '3px solid #000',
      borderRadius: '10px',
      display: 'flex',
      flexDirection: 'column',
      transitionProperty: 'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter',
      transitionDuration: '150ms',
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
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
  const [updImgURL, setUpdImgURL] = useState('');

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
      console.log(`total alunos for serie ${serie} is ${totalAlunos}`);
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
      console.log('aluno added successfully');
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
      // setIsLoading(false);
      console.log(`Request for series ${filterSelectedSeries} page ${page} completed`);
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

  const [AlunoModalInfo, setAlunoModalInfo] = useState({cpf: '', nome: '', serie: '', matricula: '', imgURL: ''});

  useEffect(() => {
    setUpdCpf(AlunoModalInfo['cpf']);
    setUpdNome(AlunoModalInfo['nome']);
    setUpdSerie(AlunoModalInfo['serie']);
    setUpdMatricula(AlunoModalInfo['matricula']);
    setUpdImgURL(AlunoModalInfo['imgURL']);
  }, [AlunoModalInfo]);

  const handleAlunoInfoRequest = async (matricula: string) => {
    try {
      console.log(`Requesting ${matricula} info...`);
      const response = await fetch(`/api/Aluno/${matricula}`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const infoData = await response.json();

      const data = { ...infoData, imgURL: '' };
      setAlunoModalInfo(data);
      console.log(data);
    }catch(e){
      console.error('There has been a problem with your fetch operation:', e);
      return;
    } finally {
      console.log('Aluno Info Request Succesfully');
    }
  }

  const handleAlunoImageRequest = async (matricula: string) => {
    try {
      console.log(`Requesting ${matricula} image...`);
      const response = await fetch(`/api/image/${matricula}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json() || { url: '' };

      setAlunoModalInfo((prevState: any) => {
        return { ...prevState, imgURL: data.url === null ? '' : data.url};
      });
      console.log(data);
    }catch(e){
      console.error('There has been a problem with your fetch operation:', e);
      return;
    } finally {
      console.log('Aluno Image Request Succesfully');
    }
  }

  const handleAlunoImageCreateRequest = async (matricula: string, imgURL: string) => {
    try {
      console.log(`Requesting image creation for ${matricula}...`);
      const response = await fetch('/api/createImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ matricula, url: imgURL })
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
      console.log('Image created successfully');
    }
  }

  const handleAlunoImageDeleteRequest = async (matricula: string) => {
    try {
      console.log(`Requesting image deletion for ${matricula}...`);
      const response = await fetch(`/api/deleteImage?matricula=${matricula}`, {
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
      console.log('Image deleted successfully');
    }
  }

  const handleAlunoImageUpdateRequest = async (matricula: string, imgURL: string) => {
    try {
      console.log(`Requesting image update for ${matricula}...`);
      const response = await fetch('/api/updateImage', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ matricula, imgURL })
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
      console.log('Image updated successfully');
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

  const [editName, setEditName] = useState(false);
  const [editSerie, setEditSerie] = useState(false);
  const [editCpf, setEditCpf] = useState(false);
  const [editImg, setEditImg] = useState(false);

  const handleInfoClose = () => {
    setEditCpf(false);
    setEditName(false);
    setEditSerie(false);
    setEditImg(false);

    setUpdCpf(AlunoModalInfo['cpf']);
    setUpdNome(AlunoModalInfo['nome']);
    setUpdSerie(AlunoModalInfo['serie']);
    setUpdMatricula(AlunoModalInfo['matricula']);
  }

  // useEffect(() => {
  //   if(editSerie === false){
  //     setUpdSerie(AlunoModalInfo['serie']);
  //   }
  // }, [editSerie, AlunoModalInfo])

  // useEffect(() => {
  //   if(editName === false){
  //     setUpdNome(AlunoModalInfo['nome']);
  //   }
  // }, [editName, AlunoModalInfo])

  // useEffect(() => {
  //   if(editCpf === false){
  //     setUpdCpf(AlunoModalInfo['cpf']);
  //   }
  // }, [editCpf, AlunoModalInfo])

  return (
    <div className='bg-[#353535] justify-center items-center h-full w-full flex flex-col'>

      {/* ALUNO INFO */}
      {InfoModalIsOpen && (
        <Modal style={modalStyles}
        isOpen={InfoModalIsOpen}
        onRequestClose={CloseInfoModal}
        contentLabel='EXAMPLE'
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={false}
        >
          <div id='InfoModalWrapper' className='flex flex-col h-full w-full overflow-y-scroll'>
            {/*main info*/}
            <div className='flex flex-col lg:flex-row w-full h-full items-start'>
              {/*Image wrapper*/}
              <div className='flex flex-col max-h-[35%] max-w-[35%]'>
                <div id='alunoIMG' className='w-full h-full border inline-block relative'>
                  {
                    AlunoModalInfo.imgURL !== '' ? (
                      <img src={updImgURL} alt='alunoIMG' className='w-full h-full rounded-lg' />
                    ) : (
                      <span className="icon-[gravity-ui--person] w-full h-full"></span>
                    )
                  }
                  <button 
                  className='lg:w-[15%] lg:h-[15%] w-[25%] h-[25%] absolute bottom-0 right-0 opacity-70 hover:opacity-100'
                  onClick={() => {
                    setEditImg(true);

                    setUpdNome(updNome);
                    setUpdCpf(updCpf);
                    setUpdSerie(updSerie);

                    setEditName(false);
                    setEditCpf(false);
                    setEditSerie(false);
                  }}>
                    <span className="icon-[carbon--camera] w-full h-full"></span>
                  </button>
                </div>
                {
                  editImg ? (
                    <div className='flex flex-row w-[85%] h-[15%]'>
                      <input id='input-img' 
                        value={updImgURL}
                        type="text" 
                        placeholder='Ex.: https://www.example.com/image.jpg'
                        onChange={(e) => setUpdImgURL(e.target.value)}
                        className='bg-[#25251D] text-[#FFFFFF] py-3 my-3 rounded-lg lg:w-[full] w-full font-serif text-lg' />
                    </div>
                  ) : (
                    <></>
                  )
                }
              </div>

              {/*Info wrapper*/}
              <div id='alunoInfo' className='flex flex-col w-full h-full'>
                {/*Aluno Info Header*/}
                <div className='justify-center items-center flex w-full flex-row bg-[#aeaeae] shadow-lg'>
                  <h2 className='text-4xl font-bold text-black '>Dados Básicos</h2>
                </div>

                <div className=' [&>*:nth-child(odd)]:bg-[#D6D6D6] [&>*:nth-child(even)]:bg-[#CACACA]'>
                  {/* Editable NAME */}
                  <div className='flex flex-row items-center space-x-6'>
                    <div className='w-[6vw]'>
                      <label className='text-[24px] font-medium text-black'>
                        Nome
                      </label>
                    </div>
                  {
                    editName ? (
                        <input 
                          id='input-nome' 
                          value={updNome} 
                          type="text" 
                          placeholder='Ex.: José da Silva'
                          onChange={(e) => setUpdNome(e.target.value)}
                          autoFocus={true}
                          className='bg-gradient-to-r from-[#747C87] from-90% to-[#25251D] text-[#FFFFFF] text-[24px] w-fit min-h-fit overflow-auto break-all font-medium shadow-[inset_0_-1px_4px_rgba(0,0,0,0.4)]' 
                          />
                    ) : (
                      <>
                        <h3 className='text-[24px] w-50% text-[#292a2b] font-serif'>{AlunoModalInfo['nome']}</h3>
                        <button
                        onClick={() => { 
                          setEditName(true);

                          setUpdCpf(updCpf);
                          setUpdSerie(updSerie);
                          
                          setEditCpf(false);
                          setEditSerie(false);
                          // setUpdSerie(Series.filter((serieObj) => serieObj['value'] === updSerie)[0]['label'])
                        }}
                        className='w-[10%] h-[75%] justify-center items-center bg-[#25251D] rounded-lg -sm:rounded-none group transition duration-75'>
                          <span className="icon-[gravity-ui--pencil-to-square] w-[65%] h-full text-white group-hover:text-[#CCCCA5] transition duration-75"></span>
                        </button>
                      </>
                    )
                  }
                  </div>
                  {/* Editable SERIE */}
                  <div className='flex flex-row items-center space-x-6'>
                    <div className='w-[6vw]'>
                      <label className='text-[24px] font-medium text-black'>
                        Série
                      </label>
                    </div>
                    {
                      editSerie ? (
                        <select id='input-serie'
                          className='bg-gradient-to-r from-[#747C87] from-90% to-[#25251D] text-[#FFFFFF] sm:rounded-lg rounded-none min-w-fit font-normal text-2xl shadow-[inset_0_-1px_4px_rgba(0,0,0,0.4)]' 
                          value={updSerie} 
                          onChange={(e) => { setUpdSerie(e.target.value); }}>
                            {Series.slice(1).map((serieObj) => (
                              <option className='text-lg font-normal' key={serieObj['label']} value={serieObj['value']}>
                                {serieObj['label']}
                              </option>
                            ))}
                        </select>
                      ) : (
                            AlunoModalInfo.serie !== '' ? (
                              <>
                                <h3 className='md:text-2xl text-[24px] font-serif text-[#292a2b]'>{Series.filter((serieObj) => serieObj['value'] === AlunoModalInfo.serie)[0]['label']}</h3>
                                <button
                                  onClick={() => {
                                    setEditSerie(true);

                                    setUpdNome(updNome);
                                    setUpdCpf(updCpf);

                                    setEditName(false);
                                    setEditCpf(false); 

                                    }}
                                  className='w-[10%] h-[75%] justify-center items-center bg-[#25251D] rounded-lg -sm:rounded-none group transition duration-75'>
                                    <span className="icon-[gravity-ui--pencil-to-square] w-[65%] h-full text-white group-hover:text-[#CCCCA5] transition duration-75"></span>
                                </button>
                              </>
                            ) : (
                              <h4> </h4>
                            )
                      )
                    }
                  </div>
                  {/* Editable CPF */}
                  <div className='flex flex-row items-center space-x-6'>
                    <div className='w-[6vw]'>
                      <label className='text-[24px] font-medium text-black'>
                        CPF
                      </label>
                    </div>
                    {
                      editCpf ? (
                        <input id='input-cpf' 
                          value={updCpf}
                          type="text" 
                          placeholder='Ex.: 000.000.000-01'
                          autoFocus={true}
                          onChange={(e) => setUpdCpf(e.target.value)}
                          className='bg-gradient-to-r from-[#747C87] from-90% to-[#25251D] text-[#FFFFFF] tracking-wide text-[24px] text-lg bg-transparent min-w-fit min-h-fit overflow-auto break-all font-light shadow-[inset_0_-1px_4px_rgba(0,0,0,0.4)]' 
                          />
                      ) : (
                        <>
                          <p className='lg:text-[24px] text-[#292a2b] text-lg font-serif tracking-wide'> {updCpf} </p>
                          <button
                            className='w-[10%] h-[75%] justify-center items-center bg-[#25251D] rounded-lg -sm:rounded-none group transition duration-75'
                            onClick={() => {
                              setEditCpf(true);
                              setEditSerie(false);
                              setEditName(false); 

                              setUpdNome(updNome);
                              setUpdSerie(updSerie);
                              }}>
                              <span className="icon-[gravity-ui--pencil-to-square] w-[65%] h-full text-white group-hover:text-[#CCCCA5] transition duration-75"></span>
                          </button>
                        </>
                      )
                    }
                  </div>
                  {/* NON-EDITABLE Matricula */}
                  <div className='flex flex-row items-center space-x-6'>
                    <div className='w-[6vw]'>
                      <label className='text-[24px] font-medium text-black'>
                        Matrícula
                      </label>
                    </div>
                    <div>
                      <p className='lg:text-[24px] text-lg text-[#292a2b] font-serif tracking-wide'> {updMatricula} </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            {/*BUTTONS*/}
            <div className='flex flex-row justify-between lg:w-full w-[95%] lg:h-[20%] h-[30%]'>
              <button className='lg:w-[49%] w-[28%] bg-[#25251D] font-sans text-base md:text-3xl tracking-wide text-[#FFFFFF] rounded-lg'
                disabled={((isLoading) || (buttonClicked))}
                onClick={(e) => {
                  handleInfoClose();
                  CloseInfoModal(e);
                }}>
                  Fechar
              </button>
              <div className='lg:w-[49%] w-[68%] flex flex-row justify-between'>
                <button className='w-[49%] bg-[#25251D] font-sans text-base md:text-2xl tracking-wide text-[#FFFFFF] rounded-lg'
                  disabled={((isLoading) || (buttonClicked))}
                  onClick={() => {
                    handleInfoClose();
                  }}>
                  Descartar
                </button>
                <button className='w-[49%] bg-[#25251D] font-sans text-base md:text-2xl tracking-wide text-[#FFFFFF] rounded-lg' 
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
                        handleInfoClose();
                        CloseInfoModal(e);
                      }
                    );
                    if((AlunoModalInfo.imgURL === '') && (updImgURL !== '')){
                      handleAlunoImageCreateRequest(updMatricula, updImgURL);
                    } else if ((AlunoModalInfo.imgURL !== '') && (updImgURL !== '')){
                      handleAlunoImageUpdateRequest(updMatricula, updImgURL);
                    }
                  }}>
                    Atualizar
                </button>
              </div>
            </div>
          </div>
      </Modal>
        )
      }
      

      {/* ADD ALUNO */}
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
        <span className='text-3xl font-bold py-4 text-[#FFFFFF]'>ESCOLA CONCEIÇÃO DA SILVA</span>
      </div>

      {/* TABLE WRAPPER */}
      <div className='flex flex-col justify-center items-center my-8 w-[80%] min-h-fit bg-[#D4D4D4]' id='TableWrapper'>
        {/* TABLE TITLE */}
        <div className='w-[95%] my-8 justify-center text-center bg-[#D4D4D4]'>
          <h2 className='text-5xl font-sans font-extrabold text-[#353535]'>LISTA DE ALUNOS</h2>
        </div>

        {/* TABLE */}
        <div className='bg-[#D4D4D4] justify-center items-center w-full min-h-fit flex flex-col' id='AlunosTable'>

          {/* TABLE HEADER */}
          <div className='flex flex-row justify-between items-center w-[95%]'>
            {/* TABLE FILTER */}
            <div id='select-label' className='flex flex-col items-start justify-center'>
              <label htmlFor="select" className='font-bold font-sans text-xl'>FILTRO POR SÉRIE</label>
              <select className='bg-[#25251D] text-[#FFFFFF] p-4 mb-2 rounded-lg w-[16vw] h-[8vh] self-start' 
              value={filterSelectedSeries} onChange={handleFilterSeriesChange}>
                {Series.map((serieObj) => (
                  <option className='pl-2' key={serieObj['label']} value={serieObj['value']}>
                    {serieObj['label']}
                  </option>
                ))}
              </select>
            </div>
            {/* ADD ALUNO BUTTON */}
            <button className='bg-[#25251D] text-[#FFFFFF] self-end mb-2 rounded-lg w-[16vw] h-[8vh] ' onClick={OpenModal}>
              <p className='font-bold font-sans text-[#FFFFFF]'>ADICIONAR ALUNO</p>
            </button>
          </div>
          
          {/* TABLE CONTENT */}
          <div className='flex flex-col w-[95%] bg-[#D4D4D4] min-h-[10vh] max-h-[40vh] overflow-y-scroll' id='AlunosWrapper'>
            <table className='border-collapse w-[full]'>
              <thead className='sticky top-[0] z-[1] bg-[#D6D6D6] shadow-lg'>
                <tr className='bg-[#AEAEAE]'>
                  <th className='text-3xl text-center'>Nome</th>
                  <th className='text-3xl text-center'>Matrícula</th>
                  <th className='text-3xl text-center'>Série</th>
                  <th className='text-xl text-center'>OPÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {empty ? (
                  <tr>
                    <td colSpan={3} className='text-base'>Nenhum aluno encontrado</td>
                  </tr>
                ) : 
                (
                  console.log('ALUNOS:', Alunos),
                  Alunos.map((aluno: any) => (
                    <tr className='even:bg-[#CACACA] odd:bg-[#D6D6D6]' key={aluno.matricula}>
                      <td className='text-base border text-center'>{aluno.nome}</td>
                      <td className='text-base border text-center'>{aluno.matricula}</td>
                      <td className='text-base border text-center'>
                        {Series.filter((serieObj) => serieObj['value'] === aluno.serie)[0]['label']}
                      </td>
                      <td className='flex flex-row w-full h-[8vh] justify-center'>
                        {
                          (renderOption === 'delete') && (SelectedMatricula === aluno.matricula) ? 
                          <>
                            <div className='flex flex-row justify-center items-center'>
                              <button className='w-[4vw] h-[4vh] lg:w-[2vw] transition duration-150 group bg-[#25251D] rounded-lg p-1 mx-1 my-2' onClick={() => {
                                handleDeleteAlunoRequest(aluno.matricula).then(
                                  () => {
                                    handleRequest();
                                    handleTotalAlunosRequest(filterSelectedSeries);
                                    setShowConfirm(!ShowConfirm);
                                  }
                                );
                                console.log('Confirmando deleção...');
                              }}>
                                <span className="icon-[gravity-ui--circle-check] w-full h-full text-white group-hover:text-[#CCCCA5]"></span>
                              </button>                           
                              <button className='w-[4vw] h-[4vh] lg:w-[2vw] transition duration-150 group bg-[#25251D] rounded-lg p-1 mx-1 my-2' onClick={() => {
                                setShowConfirm(!ShowConfirm);
                                console.log('Cancelando deleção...');
                              }}>
                                <span className="icon-[gravity-ui--circle-xmark] w-full h-full text-white group-hover:text-[#CCCCA5]"></span>
                              </button>
                            </div>
                          </> :

                          <>
                            <div className='flex flex-row mx-4 justify-center items-center'>
                              <button className='bg-[#14181d] group transition duration-150 w-[4vw] h-[4vh] lg:w-[2vw] p-1 mx-1 my-2 rounded-lg' onClick={() => {
                                handleAlunoInfoRequest(aluno.matricula).then(
                                  () => {
                                    handleAlunoImageRequest(aluno.matricula).then(
                                      () => {
                                        OpenInfoModal();
                                      }
                                    )
                                  }
                                )
                              }}>
                                <span className="icon-[gravity-ui--square-list-ul] w-full h-full text-white group-hover:text-[#CCCCA5]"></span>
                              </button>
                              <button className='bg-[#14181d] group transition duration-150 w-[4vw] h-[4vh] lg:w-[2vw] p-1 mx-1 my-2 rounded-lg' onClick={() => {
                                setSelectedMatricula(aluno.matricula);
                                setSaveOption(false);
                                setShowConfirm(true);
                                console.log('Deletando aluno...');
                              }} >
                                <span className="icon-[gravity-ui--trash-bin] w-full h-full text-white group-hover:text-[#CCCCA5]"></span>
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
          <div className='flex flex-row my-4 justify-center w-[95%] bg-[#D4D4D4]'>
            <div className='flex flex-col justify-center items-start'>
              <span className='text-center'>
                <p className=' text-sm font-bold font-serif'>Página: {page}</p>
              </span>
              <span className='text-center'>
                <p className='text-sm font-bold font-serif'>{Object.keys(Alunos[0]).length === 0 ? 0 : Alunos.length} / {page === 1 ? totalAlunos : totalAlunos - ((page - 1) * 12)} </p>
              </span>
            </div>

            <div className='ml-auto flex flex-row items-center justify-evenly space-x-auto w-[16vw] h-[8vh]'>
              <button className='bg-[#25251D] text-[#FFFFFF] p-1 justify-center items-center rounded-lg w-[30%] lg:w-[18%] h-[45%] lg:h-[70%]'
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

              <button id='PREVIOUS-BTN' className='bg-[#25251D] text-[#FFFFFF] rounded-lg w-[30%] h-[45%] lg:w-[30%] lg:h-[70%] p-1' disabled={page === 1} onClick={() => {
                handlePreviousPageRequest();
              }}>
                <span id='anterior-icon' className="icon-[gravity-ui--arrow-shape-left] w-full h-full"></span>
              </button>
              <button id='NEXT-BTN' className='bg-[#25251D] text-[#FFFFFF] rounded-lg w-[30%] h-[45%] lg:w-[30%] lg:h-[70%] p-1' disabled={nextEnabled} onClick={() => {
                handleNextPageRequest();
              }}>
                <span id='proximo-icon' className="icon-[gravity-ui--arrow-shape-right] w-full h-full"></span>
              </button>
            
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
