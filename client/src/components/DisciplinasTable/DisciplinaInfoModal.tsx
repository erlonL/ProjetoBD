import React, { useState } from 'react';
import Modal from 'react-modal';
import modalStyles from '../../utils/Disciplina/DisciplinaModalStyles'
import DisciplinaInfo from "../../utils/Disciplina/DisciplinaInfoRequests";
import Turmas from '../../utils/Aluno/Turmas';

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
        <div className='flex flex-col w-full h-full items-start'>
          <div id='DisciplinaInfo' className='flex flex-col w-full h-full'>
            <div className='justify-center items-center flex w-full flex-row bg-[#aeaeae] shadow-lg'>
              <h2 className='text-4xl font-bold text-black '>{nome}</h2>
            </div>
            <div className='flex flex-col w-full h-full'>
              <div className='flex flex-row items-center space-x-6'>
                <label className='text-[24px] font-medium text-black'>
                  Código
                </label>
                <h3 className='text-[24px] w-50% text-[#292a2b] font-serif'>{codigo}</h3>
              </div>
              <div className='flex flex-row items-center space-x-6'>
                <label className='text-[24px] font-medium text-black'>
                  Professor
                </label>
                <h3 className='text-[24px] w-50% text-[#292a2b] font-serif'>{professor}</h3>
              </div>
            </div>
          </div>
          <div className=' [&>*:nth-child(odd)]:bg-[#D6D6D6] [&>*:nth-child(even)]:bg-[#CACACA]'>
            <div className='flex flex-row items-center space-x-6'>
              <label className='text-[24px] font-medium text-black'>
                Disciplina
              </label>
              <h3 className='text-[24px] w-50% text-[#292a2b] font-serif'>{nome}</h3>
            </div>
          </div>
        </div>
      {/*BUTTONS*/}
        <div className='flex flex-row justify-between lg:w-full w-[95%] lg:h-[20%] h-[30%]'>
          <button className='w-full px-2 bg-[#25251D] font-sans text-base md:text-3xl tracking-wide text-[#FFFFFF] rounded-lg'
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