import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Link, useRoutes, Navigate } from 'react-router-dom';

import ListAlunos from './ListAlunos';
import InitialPage from './InitialPage';

function App() {




  return (
    <>
      {/* // BODY */}
      <div className='bg-gradient-to-br from-purple-600 to-blue-600 h-screen w-screen overflow-hidden flex-column justify-center items-center'>

        {/* HEADER */}
        <div className='flex w-screen justify-center bg-slate-50 m-0 '>
          <a href='/' className='flex flex-row justify-center items-center'>
            <span className='font-sans text-4xl font-bold py-4'>ESCOLA CONCEIÇÃO DA SILVA</span>
          </a>
        </div>

        {/* NAV WRAPPER */}
        <div className='flex flex-row justify-center items-center h-screen'>
          <Routes>
            <Route path='/' element={<InitialPage/>} />
            <Route path='/listAlunos' element={<ListAlunos />} />
            <Route path='/addAluno' element={<h1>ADD ALUNO</h1>} />
            <Route path='/updAluno' element={<h1>UPD ALUNO</h1>} />
            <Route path='/rmvAluno' element={<h1>RMV ALUNO</h1>} />
          </Routes>



        </div>
      </div>
    </>
  );
}

export default App;
