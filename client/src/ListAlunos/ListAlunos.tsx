import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ListAlunos = () => {

    const url = window.location.href;
    const RequestPage = parseInt(url.substring(url.indexOf('page=') + 5, url.length));

    const [Alunos, setAlunos] = useState([{}]);

    useEffect(() => {
        fetch(`/api/listAlunos?page=${RequestPage}`).then(response => {
            console.log(response);
            console.log(RequestPage);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if(data.length === 0){
                console.log('No more data to fetch');
                return;
            }
            setAlunos(data);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    }, []);

    const empty = (Alunos.length === 1) ? true : false;

    const nextEnabled = (Alunos.length < 10)

    return (
        <div className='bg-yellow-500 flex flex-column w-full' id='AlunosTable'>
            <span className='text-3xl mt-4 mb-2 justify-center items-center bg-red-500'>
                Lista de Alunos
            </span>

            <div className='flex-row justify-center items-center'>
                    {empty ? (
                        <p className='text-base'>Nenhum aluno encontrado</p>) : (
                            <ul>
                                {Alunos.map((aluno: any) => (
                                    <li key={aluno.matricula} className='text-base'>- {aluno.nome}, {aluno.matricula}</li>
                                ))}
                            </ul>
                        )     
                        }
                <p className='text-sm mt-4 h-1/3 w-1/3'>Page: {RequestPage}</p>
            </div>

            <div className='flex justify-center items-center bg-red-500 bottom-full'>
                <button className='bg-slate-200 p-2 m-2 rounded-lg' onClick={() => {
                    if(RequestPage > 1){
                        window.location.assign(`/listAlunos?page=${RequestPage - 1}`);
                    }
                }}>Anterior</button>
                <button className='bg-slate-200 p-2 m-2 rounded-lg' disabled={nextEnabled} onClick={() => {
                    window.location.assign(`/listAlunos?page=${RequestPage + 1}`);
                }}>Próxima</button>
            </div>
        </div>
    );
}

export default ListAlunos;