import React, { useState, useRef, useEffect }from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [nav, setNav] = useState('');

  const location = useLocation();

  const isAlunosRoute = location.pathname.includes('alunos');

  const isDisciplinasRoute = location.pathname.includes('disciplinas');

  const isAlunosSelected = nav === 'alunos' || isAlunosRoute;
  const isDisciplinasSelected = nav === 'disciplinas' || isDisciplinasRoute;


  return (
    <>
      <div className='flex flex-col w-screen py-4 h-[20%] justify-center items-center top-0 text-center bg-[#25455B]' id='header'>
        <span className='text-3xl font-bold py-4 text-[#FFFFFF]'>ESCOLA CONCEIÇÃO DA SILVA</span>
        <nav className='w-[30%] min-w-fit h-fit my-2 flex flex-row justify-around'>
          <Link className='w-[50%] rounded-l-full border-y border-l bg-[#25455B] h-full hover:shadow-[inset_0_0px_20px_rgba(0,0,0,0.6)] transition duration-150 ease-in-out group' 
          id={isAlunosSelected? 'enabled-link' : 'disabled-link'} 
          onClick={() => setNav('alunos')} to='/alunos'>
            <p className='font-bold py-2 px-2 text-xl text-white group-hover:opacity-80'>ALUNOS</p>
          </Link>
          <div id='separator' className='border border-[#FFFFFF]'></div>
          <Link className='w-[50%] rounded-r-full border-y border-r bg-[#25455B] h-full hover:shadow-[inset_0_0px_20px_rgba(0,0,0,0.6)] transition duration-150 ease-in-out group'
          id={isDisciplinasSelected? 'enabled-link' : 'disabled-link'} 
          onClick={() => setNav('disciplinas')} to='/disciplinas'>
            <p className='font-bold py-2 px-2 text-xl text-white group-hover:opacity-80'>DISCIPLINAS</p>
          </Link>
        </nav>
      </div>

    </>
  )
}

export default Header;