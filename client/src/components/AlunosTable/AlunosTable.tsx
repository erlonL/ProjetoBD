import React, { useEffect, useState } from "react";

import Series from "../../utils/Series";

import AlunoInfo from "../../utils/AlunoInfoRequests";
import AlunoInfoModal from "./AlunoInfoModal";
import Modal from "../modal";

const AlunosTable: React.FC = () => {
    const [Alunos, setAlunos] = useState([{}]);

    const [filterSelectedSeries, setFilterSelectedSeries] = useState(Series[0]['value']);
    const [infoModalIsOpen, setInfoModalIsOpen] = useState(false);
    const DEFAULTPAGE = 1;
    const [page, setPage] = useState(DEFAULTPAGE);
    const empty = ((Alunos === null) || (Alunos.length === 0) || (Object.keys(Alunos[0]).length === 0)) ? true : false;
    const [renderOption, setRenderOption] = useState('default');
    const [SaveOption, setSaveOption] = useState(false);
    const [ShowConfirm, setShowConfirm] = useState(false);
    const [SelectedMatricula, setSelectedMatricula] = useState('');
    const [totalAlunos, setTotalAlunos] = useState(0);
    const nextEnabled = (totalAlunos - ((page - 1) * 12)) <= 12;

    const [modalMatricula, setModalMatricula] = useState('');


    const handleFilterSeriesChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterSelectedSeries(event.target.value);
        setPage(1);
    };
    const OpenModal = () => {
        setInfoModalIsOpen(true);
    };
    const CloseModal = (e: any) => {
        e.stopPropagation();
        setInfoModalIsOpen(false);
    };

    const handleRequest = async () => {
        const data = await AlunoInfo.Alunos(page, filterSelectedSeries);
        setAlunos(data);
    }
    const handleTotalAlunosRequest = async (serie: string) => {
        const data = await AlunoInfo.Total(serie);
        setTotalAlunos(data as number);
    }
    const handleDeleteAlunoRequest = async (matricula: string) => {
        const data = await AlunoInfo.Delete(matricula);
        console.log(data);
    }
    const handleAlunoInfoRequest = async (matricula: string) => {
        const data = await AlunoInfo.Aluno(matricula);
        console.log(data);
    }
    const clearForms = () => {
        console.log('Clearing forms...');
    }
    const handleNextPageRequest = () => {
        setPage(page + 1);
    }
    const handlePreviousPageRequest = () => {
        setPage(page - 1);
    }


    
    useEffect(() => {
            if(SaveOption){
                setRenderOption('save');
            } else if(ShowConfirm){
                setRenderOption('delete');
            } else {
                setRenderOption('default');
            }
        }, [SaveOption, ShowConfirm]);

    useEffect(() => {
        handleRequest();
        setSaveOption(false);
        setShowConfirm(false);
    }, [page, filterSelectedSeries]);

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
      <>
      {
        infoModalIsOpen && (
          <AlunoInfoModal matricula={modalMatricula} isOpen={infoModalIsOpen} CloseModal={CloseModal}/>
        )
      }


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
                                {/*View aluno info*/}
                                <button className='bg-[#14181d] group transition duration-150 w-[4vw] h-[4vh] lg:w-[2vw] p-1 mx-1 my-2 rounded-lg' onClick={() => {
                                  setModalMatricula(aluno.matricula);
                                  OpenModal();
                                  console.log(`Visualizando aluno... ${aluno.matricula}`);
                                }}
                                >
                                  <span className="icon-[gravity-ui--square-list-ul] w-full h-full text-white group-hover:text-[#CCCCA5]"></span>
                                </button>
                                {/*open aluno delete confirmation*/}
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
                  <img className='w-full h-full filter invert' src={require('../../img/1atualizar.png')} alt="Atualizar"/>
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

          </div>
        </div>
      </>
    )
}

export default AlunosTable;