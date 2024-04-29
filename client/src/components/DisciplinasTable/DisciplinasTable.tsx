import React, { useEffect, useState } from "react";

import Turmas from "../../utils/Aluno/Turmas";
import AlunoInfoObject from "../../utils/Aluno/AlunoInfoInterface";
import AlunoInfo from "../../utils/Aluno/AlunoInfoRequests";
import DisciplinaInfoObject from "../../utils/Disciplina/DisciplinaInfoInterface";
import DisciplinaInfo from "../../utils/Disciplina/DisciplinaInfoRequests";
import ProfessorInfo from "../../utils/Professor/ProfessorInfoRequests";
import ProfessorInfoObject from "../../utils/Professor/ProfessorInfoInterface";
import DisciplinaInfoModal from "./DisciplinaInfoModal";

import DisciplinaModalStyles from "../../utils/Disciplina/DisciplinaModalStyles";
import MatriculadoInfo from "../../utils/Matriculado/MatriculadoInfoRequests";

const DisciplinasTable: React.FC = () => {
    const [Disciplinas, setDisciplinas] = useState([{}]);
    const DEFAULTPAGE = 1;
    const [page, setPage] = useState(DEFAULTPAGE);
    const empty = ((Disciplinas === null) || (Disciplinas.length === 0) || (Object.keys(Disciplinas[0]).length === 0)) ? true : false;

    const [renderOption, setRenderOption] = useState('default');
    const [SaveOption, setSaveOption] = useState(false);
    const [ShowConfirm, setShowConfirm] = useState(false);
    
    const [SelectedCodigo, setSelectedCodigo] = useState('');
    const [totalDisciplinas, setTotalDisciplinas] = useState(0);
    const nextEnabled = (totalDisciplinas - ((page - 1) * 12)) <= 12;

    const [infoModalIsOpen, setInfoModalIsOpen] = useState(false);
    const [addModalIsOpen, setAddModalIsOpen] = useState(false);

    const [disciplinaAlunos, setDisciplinaAlunos] = useState([{}]);
    const [disciplinaNome, setDisciplinaNome] = useState('');
    const [disciplinaCodigo, setDisciplinaCodigo] = useState('');
    const [disciplinaProfessor, setDisciplinaProfessor] = useState('');

    const [selectedDisciplina, setSelectedDisciplina] = useState({
        nome: '',
        codigo: '',
        professor: null
    });

    const [disciplinaModalInfo, setDisciplinaModalInfo] = useState<DisciplinaInfoObject>({
        nome: '',
        codigo: '',
        professor: null,
        alunos: []
    });

    const OpenInfoModal = () => {
        setInfoModalIsOpen(true);
    };
    
    const CloseInfoModal = (e: any) => {
        e.stopPropagation();
        setInfoModalIsOpen(false);
    };

    const OpenAddModal = () => {
        setAddModalIsOpen(true);
    };
    const CloseAddModal = (e: any) => {
        e.stopPropagation();
        setAddModalIsOpen(false);
    };

    {/* DISABLED
      const handleDisciplinaInfoRequest = async (codigo: string) => {
          const data = await DisciplinaInfo.Disciplina(codigo);
          console.log(data);
          if(data === undefined){
              console.log('Erro ao buscar disciplina...');
              return;
          }
  
          setDisciplinaNome(data.nome);
          setDisciplinaCodigo(data.codigo);
          const professor = await ProfessorInfo.ProfessorName(data.codigo_prof_frn);
          if(professor === undefined){
              console.log('Erro ao buscar professor...');
              return;
          }
          setDisciplinaProfessor(professor.nome_prof);
      }
  
      const handleMatriculadosRequest = async (codigo_disciplina: string) => {
          const data = await MatriculadoInfo.Matriculados(codigo_disciplina);
  
          if(data === undefined){
              console.log('Erro ao buscar matriculados...');
              return;
          }
  
          let alunos = [{}];
  
          const promises = data.map(async (matriculado: any) => {
              const aluno = await AlunoInfo.AlunoMore(matriculado.matricula_aluno_frn);
              if(aluno === undefined){
                  console.log('Erro ao buscar aluno...');
                  return;
              }
  
              console.log(aluno)
  
              alunos.push({
                  matricula: aluno.matricula,
                  nome: aluno.nome,
                  turma: aluno.turma,
                  img_url: aluno.img_url
              });
          });
  
          await Promise.all(promises);
  
          alunos.shift();
          setDisciplinaAlunos(alunos);
      }
    */}

    const handleRequest = async () => {
      const DisciplinaResponse = await DisciplinaInfo.Disciplinas(page);

      if(DisciplinaResponse === undefined){
        console.log('Erro ao buscar disciplinas...');
        return;
      }
      let data = [{}];

      const promises = DisciplinaResponse.map(async (disciplina: any) => {
        const ProfessorResponse = await ProfessorInfo.ProfessorName(disciplina.codigo_prof_frn);
        if (ProfessorResponse === undefined) {
          console.log('Erro ao buscar professor...');
          return;
        }
        const professor = ProfessorResponse.nome_prof;
        data.push({
          nome: disciplina.nome_disci,
          codigo: disciplina.codigo_disci,
          professor: professor
        });
      })

      await Promise.all(promises);

      data.shift();
      console.log(data);
      
      setDisciplinas(data);
    }

    const handleTotalDisciplinasRequest = async () => {
      const data = await DisciplinaInfo.Total();
      setTotalDisciplinas(data.total as number);
    }

    const handleDeleteDisciplinaRequest = async (codigo: string) => {
      const info_data = await DisciplinaInfo.Delete(codigo);
      console.log(info_data);
    }

    
    const handleDisciplinaMoreRequest = async (codigo: string) => {
      const data = await DisciplinaInfo.DisciplinaMore(codigo);
      setDisciplinaModalInfo({
        nome: data.Disciplina.nome_disci,
        codigo: data.Disciplina.codigo_disci,
        professor: data.Professor,
        alunos: data.Alunos
      });
      console.log(disciplinaModalInfo);
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

    const updateTable = () => {
        handleRequest();
        handleTotalDisciplinasRequest();
    }

    useEffect(() => {
      handleRequest();
      handleTotalDisciplinasRequest();
    }, [page]);
    
    useEffect(() => {
      if(SaveOption){
          setRenderOption('save');
      } else if(ShowConfirm){
          setRenderOption('delete');
      } else {
          setRenderOption('default');
      }
    }, [SaveOption, ShowConfirm]);

    const Options: React.FC<{ renderOption: string, disciplina: any; }> = ({ renderOption, disciplina }) => {
        switch(renderOption)
        {
          case 'delete':
            if(SelectedCodigo === disciplina.codigo){
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
          <DisciplinaInfoModal isOpen={infoModalIsOpen} CloseModal={CloseInfoModal} DisciplinaInfoObject={disciplinaModalInfo} updateTable={updateTable}/>
        )
      }

        <div className='flex flex-col justify-center items-center my-8 w-[80%] min-h-fit bg-[#D4D4D4]' id='TableWrapper'>
          {/* TABLE TITLE */}
          <div className='w-[95%] my-8 justify-center text-center bg-[#D4D4D4]'>
            <h2 className='text-5xl font-sans font-extrabold text-[#353535]'>DISCIPLINAS</h2>
          </div>

          {/* TABLE */}
          <div className='bg-[#D4D4D4] justify-center items-center w-full min-h-fit flex flex-col' id='AlunosTable'>

            {/* TABLE HEADER */}
            {/*use it for auxiliary buttons or info for the table*/}
            <div className='flex flex-row justify-between items-center w-[95%]'>
              {/* ADD ALUNO BUTTON */}
              {/*DISABLED
                <button className='bg-[#25251D] text-[#FFFFFF] self-end mb-2 rounded-lg w-[16vw] h-[8vh] ' onClick={OpenAddModal}>
                  <p className='font-bold font-sans text-[#FFFFFF]'>ADICIONAR DISCIPLINA</p>
                </button>
              */}
            </div>
            
            {/* TABLE CONTENT */}
            <div className='flex flex-col w-[95%] bg-[#D4D4D4] min-h-[10vh] max-h-[40vh] overflow-y-scroll' id='AlunosWrapper'>
              <table className='border-collapse w-[full]'>
                <thead className='sticky top-[0] z-[1] bg-[#D6D6D6] shadow-lg'>
                  <tr className='bg-[#AEAEAE]'>
                    <th className='text-3xl text-center'>Código</th>
                    <th className='text-3xl text-center'>Disciplina</th>
                    <th className='text-3xl text-center'>Professor</th>
                    <th className='text-xl text-center'>OPÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  {empty ? (
                    <tr>
                      <td colSpan={3} className='text-base'>Nenhuma disciplina encontrada</td>
                    </tr>
                  ) : 
                  (
                    Disciplinas.map((disciplina: any) => (
                      <tr className='even:bg-[#CACACA] odd:bg-[#D6D6D6]' key={disciplina.codigo}>
                        <td className='text-base border text-center'>{disciplina.codigo}</td>
                        <td className='text-base border text-center'>{disciplina.nome}</td>
                        <td className='text-base border text-center'>{disciplina.professor}</td>
                        <td className='flex flex-row w-full h-[8vh] justify-center'>
                          {
                            (renderOption === 'delete') && (SelectedCodigo === disciplina.codigo) ? 
                            <>
                              <div className='flex flex-row justify-center items-center'>
                                <button className='w-[4vw] h-[4vh] lg:w-[2vw] transition duration-150 group bg-[#25251D] rounded-lg p-1 mx-1 my-2' onClick={() => {
                                  handleDeleteDisciplinaRequest(disciplina.codigo).then(
                                    () => {
                                      handleRequest();
                                      handleTotalDisciplinasRequest();
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
                                {/*View disciplina info*/}
                                <button className='bg-[#14181d] group transition duration-150 w-[4vw] h-[4vh] lg:w-[2vw] p-1 mx-1 my-2 rounded-lg' onClick={() => {
                                  handleDisciplinaMoreRequest(disciplina.codigo).then(() => {
                                    OpenInfoModal();
                                  })
                                  console.log(`Visualizando disciplina... ${disciplina.codigo}`);
                                }}
                                >
                                  <span className="icon-[gravity-ui--square-list-ul] w-full h-full text-white group-hover:text-[#CCCCA5]"></span>
                                </button>
                                {/*open disciplina delete confirmation*/}
                                <button className='bg-[#14181d] group transition duration-150 w-[4vw] h-[4vh] lg:w-[2vw] p-1 mx-1 my-2 rounded-lg' onClick={() => {
                                  setSelectedCodigo(disciplina.codigo);
                                  setSaveOption(false);
                                  setShowConfirm(true);
                                  console.log('Deletando disciplina...');
                                }} >
                                  <span className="icon-[gravity-ui--trash-bin] w-full h-full text-white group-hover:text-[#CCCCA5]"></span>
                                </button>
                              </div>
                            </>
                          }
                          <Options renderOption={renderOption} disciplina={disciplina} />
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
                  <p className='text-sm font-bold font-serif'>{Object.keys(Disciplinas[0]).length === 0 ? 0 : Disciplinas.length} / {page === 1 ? totalDisciplinas : totalDisciplinas - ((page - 1) * 12)} </p>
                </span>
              </div>

              <div className='ml-auto flex flex-row items-center justify-evenly space-x-auto w-[16vw] h-[8vh]'>
                <button className='bg-[#25251D] text-[#FFFFFF] p-1 justify-center items-center rounded-lg w-[30%] lg:w-[18%] h-[45%] lg:h-[70%]'
                onClick={() => {
                  updateTable();
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

export default DisciplinasTable;