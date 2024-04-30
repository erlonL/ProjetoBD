import React, { useState } from 'react';
import Modal from 'react-modal';
import modalStyles from '../../utils/Disciplina/DisciplinaModalStyles'
import DisciplinaInfo from "../../utils/Disciplina/DisciplinaInfoRequests";
import Turmas from '../../utils/Aluno/Turmas';
import AlunoInfoObject from '../../utils/Aluno/AlunoInfoInterface';

import DisciplinaInfoObject from '../../utils/Disciplina/DisciplinaInfoInterface';

interface DisciplinaInfoModalProps {
  isOpen: boolean;
  CloseModal: (e: any) => void;
  DisciplinaInfoObject: DisciplinaInfoObject;
  updateTable: () => void;
}

const DisciplinaInfoModal: React.FC<DisciplinaInfoModalProps> = ({ isOpen, CloseModal, DisciplinaInfoObject, updateTable}) => {
  const [InfoModalIsOpen, setInfoModalIsOpen] = useState(isOpen);

  const [DisciplinaModalInfo, setDisciplinaModalInfo] = useState(DisciplinaInfoObject);

  const [nome, setNome] = useState(DisciplinaInfoObject.nome);
  const [codigo, setCodigo] = useState(DisciplinaInfoObject.codigo);
  const [professor, setProfessor] = useState(DisciplinaInfoObject.professor);
  const [alunos, setAlunos] = useState(DisciplinaInfoObject.alunos);

  console.log(alunos);

  console.log(Turmas.filter((turmaObj) => turmaObj['value'] === alunos[0].turma)[0]['label']);

  const CloseInfoModal = (e: any) => {
    e.stopPropagation();
    setInfoModalIsOpen(false);
    CloseModal(e);
  };

  console.log(DisciplinaModalInfo);

  return (
    <Modal style={modalStyles}
    isOpen={InfoModalIsOpen}
    onRequestClose={CloseInfoModal}
    contentLabel='EXAMPLE'
    shouldCloseOnEsc={true}
    shouldCloseOnOverlayClick={false}
    >
      <div id='InfoModalWrapper' className='flex flex-col h-full w-full overflow-y-scroll'>   
        {/*BASIC DATA*/}
        <div id='DisciplinaInfo' className='flex flex-col w-full h-fit'>
          <div className='flex flex-col justify-center items-center'>
            <h3 className='w-full px-4 mb-8 flex items-center justify-center text-[48px] text-[#cd ] font-bold shadow-[inset_0_0px_10px_rgba(0,0,0,0.6)] border border-black'>
              {nome}
            </h3>
            <h3 className='text-[36px] text-[#292a2b] font-serif'>Professor Associado</h3>
            <div className='flex flex-col justify-center items-center bg-[#828891] shadow-[inset_0_0px_10px_rgba(0,0,0,0.6)] border border-black'>
              <img className='object-fill max-w-[20vw] max-h-[20vh] my-2' src={professor.url} alt="professor img" />
              <div className='flex flex-col space-y-1 p-2 items-center'>
                <h4 className='text-[24px] text-[#292a2b] font-serif'>{professor.nome_prof}</h4>
                <h4 className='text-[24px] text-[#292a2b] font-serif'>{professor.codigo_prof}</h4>
                <h4 className='text-[24px] text-[#292a2b] font-serif'>{professor.email_prof}</h4>
              </div>

            </div>

            <h3 className='text-[36px] text-[#292a2b] font-serif mt-8'>Alunos</h3>
            <div className='grid grid-cols-5 gap-4 space-y-1 mb-12'>
              {alunos.map((aluno) => {
                const aluno_turma = Turmas.filter((turmaObj) => turmaObj['value'] === aluno.turma)[0]['label'];
                console.log(aluno_turma);
                return (
                  <div key={aluno.matricula_aluno} className='bg-[#868c94] shadow-[inset_0_0px_10px_rgba(0,0,0,0.6)] border border-black flex flex-col items-center px-2 py-4'>
                    <img className='object-fill max-w-[4vw] max-h-[7vh]' src={aluno.url} alt="aluno img" />
                    <h4 className='text-[24px] text-[#292a2b] font-serif'>{aluno.nome_aluno}</h4>
                    <h4 className='text-[24px] text-[#292a2b] font-serif'>{aluno.matricula_aluno}</h4>
                    <h4 className='text-[24px] text-[#292a2b] font-serif'>{aluno_turma}</h4>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/*BUTTONS*/}
        <div className='flex flex-row justify-between w-full h-[30%]'>
          <button className='w-full px-2 py-4 bg-[#25251D] font-sans text-base md:text-3xl tracking-wide text-[#FFFFFF] rounded-lg'
          onClick={(e) => {
              CloseInfoModal(e);
          }}>
              Fechar
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default DisciplinaInfoModal;