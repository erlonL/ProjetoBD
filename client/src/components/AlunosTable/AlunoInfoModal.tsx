import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import modalStyles from '../../utils/ModalStyles'
import AlunoInfo from "../../utils/AlunoInfoRequests";
import Series from '../../utils/Series';
import AlunoIMG from '../../utils/AlunoIMGRequests';



interface AlunoInfoModalProps {
  matricula: string;
  isOpen: boolean;
  CloseModal: (e: any) => void;
}

const AlunoInfoModal: React.FC<AlunoInfoModalProps> = ({ matricula, isOpen, CloseModal}) => {
  const [InfoModalIsOpen, setInfoModalIsOpen] = useState(isOpen);

  const [AlunoModalInfo, setAlunoModalInfo] = useState({ matricula: '', cpf: '', nome: '', serie: '', img_url: '' });
  
  const [updMatricula, setUpdMatricula] = useState('');
  const [updNome, setUpdNome] = useState('');
  const [updSerie, setUpdSerie] = useState('');
  const [updCpf, setUpdCpf] = useState('');
  const [updImg_url, setUpdImg_url] = useState('');

  const [editName, setEditName] = useState(false);
  const [editSerie, setEditSerie] = useState(false);
  const [editCpf, setEditCpf] = useState(false);
  const [editImg, setEditImg] = useState(false);
  
  const handleAlunoMoreRequest = async (matricula: string) => {
    try {
      console.log(`Requesting ${matricula} info...`);
      const response = await AlunoInfo.AlunoMore(matricula);
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const infoData = await response.json();
      console.log(infoData);
      setAlunoModalInfo(infoData);
    }catch(e){
      console.error('There has been a problem with your fetch operation:', e);
      return;
    } finally {
      console.log('Aluno Info Request Succesfully');
    }
  };

  const handleUpdateAlunoInfoRequest = async (matricula: string, data: any) => {
    try {
      console.log(`Requesting ${matricula} info update...`);
      const response = await AlunoInfo.Update(matricula, data);
  
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
      console.log('Aluno Info Update Request Succesfully');
    }
  }

  const handleAlunoImageCreateRequest = async (matricula: string, imgURL: string) => {
    try {
      console.log(`Requesting image creation for ${matricula}...`);
      const response = await AlunoIMG.Create(matricula, imgURL);
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const responseJSON = await response.json();
      return responseJSON;
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
      const response = await AlunoIMG.Update(matricula, imgURL);
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const responseJSON = await response.json();
      return responseJSON;
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

  const OpenInfoModal = () => {
    setInfoModalIsOpen(true);
  };

  const handleInfoClose = () => {
    setEditName(false);
    setEditSerie(false);
    setEditCpf(false);
    setEditImg(false);
  };

  useEffect(() => {
    handleAlunoMoreRequest(matricula).then(() => {
      setUpdCpf(AlunoModalInfo.cpf);
      setUpdNome(AlunoModalInfo.nome);
      setUpdSerie(AlunoModalInfo.serie);
      setUpdMatricula(AlunoModalInfo.matricula);
      setUpdImg_url(AlunoModalInfo.img_url);
      console.log(AlunoModalInfo);
      console.log(updCpf, updNome, updSerie, updMatricula, updImg_url)
    })
  }, []);

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
            <div className='flex flex-col max-h-[35%] max-w-[35%]'>
            <div id='alunoIMG' className='w-full h-full border inline-block relative'>
            {
                AlunoModalInfo.img_url !== '' ? (
                    <img src={updImg_url} alt='alunoIMG' className='w-full h-full rounded-lg' />
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
                            value={updImg_url}
                            type="text" 
                            placeholder='Ex.: https://www.example.com/image.jpg'
                            onChange={(e) => setUpdImg_url(e.target.value)}
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
          
          onClick={(e) => {
              handleInfoClose();
              CloseInfoModal(e);
          }}>
              Fechar
          </button>
          
          <div className='lg:w-[49%] w-[68%] flex flex-row justify-between'>
            
            <button className='w-[49%] bg-[#25251D] font-sans text-base md:text-2xl tracking-wide text-[#FFFFFF] rounded-lg'
            
            onClick={() => {
            handleInfoClose();
            }}>
            Descartar
            </button>

            <button className='w-[49%] bg-[#25251D] font-sans text-base md:text-2xl tracking-wide text-[#FFFFFF] rounded-lg' 
                
                onClick={(e) => {
                e.preventDefault();
                console.log(`Updating alunoInfo ${updMatricula}`);
                const data = { nome: updNome, cpf: updCpf, serie: updSerie};
                console.log(data);
                
                handleUpdateAlunoInfoRequest(updMatricula, data);

                if((AlunoModalInfo.img_url === '') && (updImg_url !== '')){
                    handleAlunoImageCreateRequest(updMatricula, updImg_url);
                } else if ((AlunoModalInfo.img_url !== '') && (updImg_url !== '')){
                    handleAlunoImageUpdateRequest(updMatricula, updImg_url);
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

export default AlunoInfoModal;