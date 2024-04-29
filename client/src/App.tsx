import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

import AlunosTable from './components/AlunosTable/AlunosTable';
import DisciplinasTable from './components/DisciplinasTable/DisciplinasTable';
import './App.css';

function App() {
  return (
    <div className='bg-[#353535] justify-center items-center h-full w-full flex flex-col'>

      <Header />
        <Routes>
          <Route path='/' element={<AlunosTable/>} />
          <Route path='alunos' element={<AlunosTable/>} />
          <Route path='disciplinas' element={<DisciplinasTable/>} />
        </Routes>

      <Footer/>

    </div>
  );
}

export default App;
