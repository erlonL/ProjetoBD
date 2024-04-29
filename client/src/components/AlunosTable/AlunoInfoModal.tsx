import React, { useState } from 'react';
import Modal from 'react-modal';
import modalStyles from '../../utils/Aluno/AlunoModalStyles'
import AlunoInfo from "../../utils/Aluno/AlunoInfoRequests";
import Turmas from '../../utils/Aluno/Turmas';
import AlunoIMG from '../../utils/Aluno/AlunoIMGRequests';

import AlunoInfoObject from '../../utils/Aluno/AlunoInfoInterface';

interface AlunoInfoModalProps {
  isOpen: boolean;
  CloseModal: (e: any) => void;
  AlunoInfoObject: AlunoInfoObject;
  updateTable: () => void;
}

const AlunoInfoModal: React.FC<AlunoInfoModalProps> = ({ isOpen, CloseModal, AlunoInfoObject, updateTable}) => {
  const [InfoModalIsOpen, setInfoModalIsOpen] = useState(isOpen);

  const [AlunoModalInfo, setAlunoModalInfo] = useState(AlunoInfoObject);

  const MATRICULA = AlunoInfoObject.matricula;
  const [updNome, setUpdNome] = useState(AlunoInfoObject.nome);
  const [updTurma, setUpdTurma] = useState(AlunoInfoObject.turma);
  const [updCpf, setUpdCpf] = useState(AlunoInfoObject.cpf);
  const [updImg_url, setUpdImg_url] = useState(AlunoInfoObject.img_url);

  const [editName, setEditName] = useState(false);
  const [editTurma, setEditTurma] = useState(false);
  const [editCpf, setEditCpf] = useState(false);
  const [editImg, setEditImg] = useState(false);

  const handleUpdateAlunoInfoRequest = async (matricula: string, data: any) => {
    try {
      console.log(`Requesting ${matricula} info update...`);
      await AlunoInfo.Update(matricula, data);

    }catch(e){
      console.error('There has been a problem with your fetch operation:', e);
      return;
    } finally {
      console.log('Aluno Info Update Request Succesfully');
    }
  }

  const handleAlunoImageCreateRequest = async (matricula: string, imgURL: string) => {
    try {
      console.log(`Requesting image creation for ${matricula}...`);
      await AlunoIMG.Create(matricula, imgURL).then(() => {
        setAlunoModalInfo({
          matricula: matricula,
          nome: updNome,
          turma: updTurma,
          cpf: updCpf,
          img_url: imgURL
        })
      }).then(() => {
        setEditName(false);
        setEditTurma(false);
        setEditCpf(false);
        setEditImg(false);
      })
    }catch(e){
      console.error('There has been a problem with your fetch operation:', e);
      return;
    }finally{
      console.log('Image created successfully');
    }
  }

  const handleAlunoImageUpdateRequest = async (matricula: string, imgURL: string) => {
    try {
      console.log(`Requesting image update for ${matricula}...`);
      await AlunoIMG.Update(matricula, imgURL).then(() => {
        setAlunoModalInfo({
          matricula: matricula,
          nome: updNome,
          turma: updTurma,
          cpf: updCpf,
          img_url: imgURL
        })
      }).then(() => {
        setEditName(false);
        setEditTurma(false);
        setEditCpf(false);
        setEditImg(false);
      })
    }catch(e){
      console.error('There has been a problem with your fetch operation:', e);
      return;
    } finally {
      console.log('Image updated successfully');
    }
  }

  const CloseInfoModal = (e: any) => {
    e.stopPropagation();
    setInfoModalIsOpen(false);
    CloseModal(e);
  };

  const handleInfoClose = () => {
    setEditName(false);
    setEditTurma(false);
    setEditCpf(false);
    setEditImg(false);
  };

  const discardChanges = () => {
    setUpdNome(AlunoInfoObject.nome);
    setUpdCpf(AlunoInfoObject.cpf);
    setUpdTurma(AlunoInfoObject.turma);
    setUpdImg_url(AlunoInfoObject.img_url);
  }

  return (
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
            <div className='flex flex-col min-h-[35%] min-w-[35%] h-[80%] w-[35%]'>
            <div id='alunoIMG' className='w-full h-full border inline-block relative'>
            {
              (updImg_url === '') ? (
                <span className="icon-[gravity-ui--person] w-full h-full"></span>
              ) : (
                <img src={updImg_url} alt='alunoIMG' className='w-full h-full rounded-lg' />
              )
            }
            <button 
                className='lg:w-[15%] lg:h-[15%] w-[25%] h-[25%] absolute bottom-0 right-0 opacity-70 hover:opacity-100'
                onClick={() => {
                    setEditImg(true);

                    setUpdNome(updNome);
                    setUpdCpf(updCpf);
                    setUpdTurma(updTurma);

                    setEditName(false);
                    setEditCpf(false);
                    setEditTurma(false);
                }}>
                <span className="icon-[carbon--camera] w-full h-full"></span>
            </button>
            </div>
                {
                    editImg ? (
                      <div className='flex flex-row justify-between items-center'>
                          <input id='input-img' 
                            value={updImg_url}
                            type="text" 
                            placeholder='Ex.: https://www.example.com/image.jpg'
                            onChange={(e) => setUpdImg_url(e.target.value)}
                            className='bg-[#25251D] text-[#FFFFFF] py-3 w-[80%] rounded-lg h-[70%] font-serif text-lg' 
                          />
                          <button
                            className=' p-1 w-[15%] h-[70%] bg-[#25251D] rounded-lg -sm:rounded-none group transition duration-75'
                            onClick={() => {
                              setEditImg(false);
                              setEditName(false);
                              setEditCpf(false);
                              setEditTurma(false);
                            }}>
                            <span className="icon-[gravity-ui--circle-check-fill] w-full h-full text-white group-hover:text-[#CCCCA5] transition duration-75"></span>
                          </button>
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
                          <>
                            <input 
                              id='input-nome' 
                              value={updNome} 
                              type="text" 
                              placeholder='Ex.: José da Silva'
                              onChange={(e) => setUpdNome(e.target.value)}
                              autoFocus={true}
                              className='bg-gradient-to-r from-[#747C87] from-90% to-[#25251D] text-[#FFFFFF] text-[24px] w-fit min-h-fit overflow-auto break-all font-medium shadow-[inset_0_-1px_4px_rgba(0,0,0,0.4)]' 
                            />
                            <button
                            className='w-[10%] h-full p-1 bg-[#25251D] rounded-lg -sm:rounded-none group transition duration-75'
                            onClick={() => {
                              setEditCpf(false);
                              setEditTurma(false);
                              setEditName(false); 
                            }}>
                              <span className="icon-[gravity-ui--check] text-white group-hover:text-[#CCCCA5] transition duration-75"></span>
                            </button>
                          </>
                        ) : (
                        <>
                        <h3 className='text-[24px] w-50% text-[#292a2b] font-serif'>{updNome}</h3>
                        <button
                        onClick={() => { 
                        setEditName(true);

                        setUpdCpf(updCpf);
                        setUpdTurma(updTurma);
                        
                        setEditCpf(false);
                        setEditTurma(false);
                        // setUpdTurma(Turmas.filter((turmaObj) => turmaObj['value'] === updTurma)[0]['label'])
                        }}
                        className='w-[10%] h-full p-1 bg-[#25251D] rounded-lg -sm:rounded-none group transition duration-75'>
                        <span className="icon-[gravity-ui--pencil-to-square] text-white group-hover:text-[#CCCCA5] transition duration-75"></span>
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
                    editTurma ? (
                      <>
                        <select id='input-turma'
                        className='bg-gradient-to-r from-[#747C87] from-90% to-[#25251D] text-[#FFFFFF] sm:rounded-lg rounded-none min-w-fit font-normal text-2xl shadow-[inset_0_-1px_4px_rgba(0,0,0,0.4)]' 
                        value={updTurma} 
                        onChange={(e) => { setUpdTurma(e.target.value); }}>
                            {Turmas.slice(1).map((turmaObj) => (
                              
                              <option className='text-lg font-normal' key={turmaObj['label']} value={turmaObj['value']}>
                                {turmaObj['label']}
                            </option>
                            ))}
                        </select>
                        <button
                            className='w-[10%] h-full p-1 bg-[#25251D] rounded-lg -sm:rounded-none group transition duration-75'
                            onClick={() => {
                              setEditCpf(false);
                              setEditTurma(false);
                              setEditName(false); 
                            }}>
                            <span className="icon-[gravity-ui--check] text-white group-hover:text-[#CCCCA5] transition duration-75"></span>
                        </button>
                      </>
                    ) : (
                            AlunoModalInfo.turma !== '' ? (
                            <>
                                <h3 className='md:text-2xl text-[24px] font-serif text-[#292a2b]'>{Turmas.filter((turmaObj) => turmaObj['value'] === updTurma)[0]['label']}</h3>
                                <button
                                onClick={() => {
                                    setEditTurma(true);
                                    setEditName(false);
                                    setEditCpf(false); 

                                    }}
                                className='w-[10%] h-full p-1 bg-[#25251D] rounded-lg -sm:rounded-none group transition duration-75'>
                                    <span className="icon-[gravity-ui--pencil-to-square] text-white group-hover:text-[#CCCCA5] transition duration-75"></span>
                                </button>
                            </>
                            ) : (
                              <></>
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
                      <>
                        <input id='input-cpf' 
                          value={updCpf}
                          type="text" 
                          placeholder='Ex.: 000.000.000-01'
                          autoFocus={true}
                          onChange={(e) => setUpdCpf(e.target.value)}
                          className='bg-gradient-to-r from-[#747C87] from-90% to-[#25251D] text-[#FFFFFF]
                          tracking-wide text-[24px] text-lg bg-transparent min-w-fit min-h-fit
                          overflow-auto break-all font-light shadow-[inset_0_-1px_4px_rgba(0,0,0,0.4)]' 
                          />
                        <button
                            className='w-[10%] h-full p-1 bg-[#25251D] rounded-lg -sm:rounded-none group transition duration-75'
                            onClick={() => {
                              setEditCpf(false);
                              setEditTurma(false);
                              setEditName(false); 
                            }}>
                            <span className="icon-[gravity-ui--check] text-white group-hover:text-[#CCCCA5] transition duration-75"></span>
                        </button>
                      </>
                    ) : (
                        <>
                        <p className='lg:text-[24px] text-[#292a2b] text-lg font-serif tracking-wide'> {updCpf} </p>
                        <button
                            className='w-[10%] h-full p-1 bg-[#25251D] rounded-lg -sm:rounded-none group transition duration-75'
                            onClick={() => {
                            setEditCpf(true);
                            setEditTurma(false);
                            setEditName(false); 
                            }}>
                            <span className="icon-[gravity-ui--pencil-to-square] text-white group-hover:text-[#CCCCA5] transition duration-75"></span>
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
                      <p className='lg:text-[24px] text-lg text-[#292a2b] font-serif tracking-wide'> {MATRICULA} </p>
                    </div>
                </div>

                </div>
            </div>
        </div>

        {/*BUTTONS*/}
        <div className='flex flex-row justify-between lg:w-full w-[95%] lg:h-[20%] h-[30%]'>
          {/*close*/}
          <button className='lg:w-[49%] w-[28%] bg-[#25251D] font-sans text-base md:text-3xl tracking-wide text-[#FFFFFF] rounded-lg'
          onClick={(e) => {
              handleInfoClose();
              CloseInfoModal(e);
          }}>
              Fechar
          </button>
          {/*update // discard*/}
          <div className='lg:w-[49%] w-[68%] flex flex-row justify-between'>
            {/*discard*/}
            <button className='w-[49%] bg-[#25251D] font-sans text-base md:text-2xl tracking-wide text-[#FFFFFF] rounded-lg'
            onClick={() => {
              discardChanges();
              handleInfoClose();
            }}>
            Descartar
            </button>
            {/*update*/}
            <button className='w-[49%] bg-[#25251D] font-sans text-base md:text-2xl tracking-wide text-[#FFFFFF] rounded-lg'      
                onClick={(e) => {
                e.preventDefault();
                console.log(`Updating alunoInfo ${MATRICULA}`);
                const data = { nome: updNome, cpf: updCpf, turma: updTurma};
                
                handleUpdateAlunoInfoRequest(MATRICULA, data).then(() => {
                    handleAlunoImageUpdateRequest(MATRICULA, updImg_url);
                  }
                ).then(() => {
                  handleInfoClose();
                  updateTable();
                  CloseInfoModal(e);
                })
                }}>
              Atualizar
            </button>

          </div>

        </div>
      </div>
    </Modal>
  )    
}

export default AlunoInfoModal;