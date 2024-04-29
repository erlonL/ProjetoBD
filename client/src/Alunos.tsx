import Header from './components/Header';
import Footer from './components/Footer';
import AlunosTable from './components/AlunosTable/AlunosTable';

function Alunos() {
  return (
    <div className='bg-[#353535] justify-center items-center h-full w-full flex flex-col'>

      <Header />

      <AlunosTable/>

      <Footer/>

    </div>
  );
}

export default Alunos;