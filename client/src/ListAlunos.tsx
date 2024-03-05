import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';


const ListAlunos: React.FC = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const RequestPage = Number(query.get('page')) || 1;

    const [Alunos, setAlunos] = useState([{}]);

    useEffect(() => {
        fetch(`/api/listAlunos?page=${RequestPage}`).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            setAlunos(data);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    }, []);

    return (
        <div className='bg-slate-400 m-10 p-8 mx-4 flex-row' id='AlunosTable'>

            <div className='flex-row justify-center items-center'>
                <h1 className='text-xl mt-4 mb-2'>Lista de Alunos</h1>
                <ul>
                    {Alunos.map((aluno: any) => (
                        <li key={aluno.matricula} className='text-base'>- {aluno.nome}, {aluno.matricula}</li>
                        ))}
                </ul>
                <p className='text-sm mt-4'>Page: {RequestPage}</p>
            </div>

            <div className='flex-row justify-center items-center'>

                <div className='flex justify-center items-center bg-red-500'>
                    <button className='bg-slate-200 p-2 m-2 rounded-lg' onClick={() => {
                        if(RequestPage > 1){
                            window.location.assign(`/listAlunos?page=${RequestPage - 1}`);
                        }
                    }}>Anterior</button>
                    <button className='bg-slate-200 p-2 m-2 rounded-lg' onClick={() => {
                        window.location.assign(`/listAlunos?page=${RequestPage + 1}`);
                    }}>Próxima</button>
                </div>

            </div>
        </div>
    );
}

export default ListAlunos;