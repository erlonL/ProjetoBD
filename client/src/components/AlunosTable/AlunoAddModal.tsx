import React, { useState, useEffect } from "react";

import Modal from "react-modal";
import modalStyles from "../../utils/ModalStyles";
import Turmas from "../../utils/Aluno/Turmas";

import AlunoInfo from "../../utils/Aluno/AlunoInfoRequests";
import AlunoIMG from "../../utils/Aluno/AlunoIMGRequests";

interface AlunoAddModalProps {
    isOpen: boolean;
    CloseModal: (e: any) => void;
    updateTable: () => void;
}

const AlunoAddModal: React.FC<AlunoAddModalProps> = ({ isOpen, CloseModal, updateTable }) => {

  const [addModalIsOpen, setAddModalIsOpen] = useState(isOpen);
  // const [addAlunoInfo, setAddAlunoInfo] = useState({ nome: '', cpf: '', turma: Turmas[1]['value'], img_url: '' });

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [turma, setTurma] = useState(Turmas[1]['value']);
  const [img_url, setImgUrl] = useState('');

  const clearForms = () => {
    setNome('');
    setCpf('');
    setTurma('');
    setImgUrl('');
  }

  const handleAddAlunoRequest = async (data: any) => {
    const infodata = {
      nome: data.nome,
      cpf: data.cpf,
      turma: data.turma,
    }

    const Aluno = await AlunoInfo.Create(infodata);
    const alunoMatricula = Aluno.matricula;

    await AlunoIMG.Create(alunoMatricula, img_url).then(() => {
      console.log(`aluno ${alunoMatricula} added successfully`);
    })
  }


  return(
    <Modal style={modalStyles}
    isOpen={addModalIsOpen}
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
              <select id='input-turma'
                className='bg-[#25251D] text-[#FFFFFF] p-2 m-2 rounded-lg w-[20vw] font-serif text-lg ' 
                value={turma} 
                onChange={(e) => {
                setTurma(e.target.value);
                }}>
                  {Turmas.slice(1).map((turmaObj) => (
                    <option className='text-lg font-serif text-black' key={turmaObj['label']} value={turmaObj['value']}>
                      {turmaObj['label']}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </form>
      </div>
      <div className='flex flex-row justify-evenly'>
        <button className='w-[20vw] bg-[#25251D] text-[#FFFFFF] p-2 m-2 rounded-lg'
        
        onClick={(e) => {
          e.preventDefault();
          console.log('Closing modal...');
          clearForms();
          CloseModal(e);
        }}>
          Fechar
        </button>
        <button className='w-[20vw] bg-[#25251D] text-[#FFFFFF] p-2 m-2 rounded-lg ' 
        
        onClick={(e) => {
          // e.preventDefault();
          console.log('Saving new aluno...');
          const data = { nome, cpf, turma };

          handleAddAlunoRequest(data).then(
            () => {
              updateTable();
              clearForms();
              CloseModal(e);
            }
          );
        }}>
          Salvar
        </button>
      </div>
  </Modal>
  )
}


export default AlunoAddModal;