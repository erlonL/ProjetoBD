const setNav = (nav: string) => {
    window
        .location
        .assign(nav);
}

const elements = [
    ['listAlunos', 'LISTAR ALUNOS'],
    ['addAluno', 'ADICIONAR ALUNO'],
    ['updAluno', 'ATUALIZAR ALUNO'],
    ['rmvAluno', 'REMOVER ALUNO']
]

const InitialPage = () => {
    return (
        <>
        {elements.map(([key, text]) => (
            <div key={key} onClick={() => setNav(key)} className='flex justify-center items-center mx-5 bg-white cursor-pointer select-none h-32 w-64 rounded-3xl'>
                <p className='text-2xl font-bold mx-1'>{text}</p>
            </div>
        ))
        }
        </>
    );
}

export default InitialPage;