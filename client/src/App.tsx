import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Header from './components/Header';
import Footer from './components/Footer';
import Table from './components/AlunosTable/AlunosTable';
import AlunoInfoModal from './components/AlunosTable/AlunoInfoModal';
import modalStyles from './utils/ModalStyles';
import Series from './utils/Series';
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
  const [Alunos, setAlunos] = useState([{}]);
  const [filterSelectedSeries, setFilterSelectedSeries] = useState(Series[0]['value']);

  const DEFAULTPAGE = 1;
  const [page, setPage] = useState(DEFAULTPAGE);

  const [SaveOption, setSaveOption] = useState(false);
  const [ShowConfirm, setShowConfirm] = useState(false);
  const [SelectedMatricula, setSelectedMatricula] = useState('');
  const [ModalIsOpen, setModalIsOpen] = useState(false);

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [serie, setSerie] = useState(Series[1]['value']);

  const [isLoading, setIsLoading] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const [totalAlunos, setTotalAlunos] = useState(0);

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

  const OpenModal = () => {
    setModalIsOpen(true);
  };

  const CloseModal = (e: any) => {
    e.stopPropagation();
    setModalIsOpen(false);
  };

  useEffect(() => {
    handleRequest();
    setSaveOption(false);
    setShowConfirm(false);
  }, [page, filterSelectedSeries]);


  useEffect(() => {
    handleTotalAlunosRequest(filterSelectedSeries);
  }, [filterSelectedSeries]);

  const [AlunoModalInfo, setAlunoModalInfo] = useState({cpf: '', nome: '', serie: '', matricula: '', imgURL: ''});

  return (
    <div className='bg-[#353535] justify-center items-center h-full w-full flex flex-col'>
      

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

      <Header />

      <Table/>

      <Footer/>

    </div>
  );
}

export default App;
