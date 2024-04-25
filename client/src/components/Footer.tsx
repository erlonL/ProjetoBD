import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className='bg-[#284B63] w-full shadow-[0_50vh_0_50vh_#284B63] justify-center flex' id='footer'>
            <div className='w-[12vw] h-[8vh] flex justify-center items-center bg-slate-600 rounded-3xl z-10'>
                {/* <span className='text-4xl font-bold py-4 justify-center items-center flex flex-col'> */}
                <div className='w-[140px] h-[50px] justify-center items-center flex bg-[#25251D] text-[#FFFFFF] rounded-3xl z-10'>
                    <a href="https://github.com/erlonl/"
                    className='flex flex-row justify-center items-center w-full h-full rounded-3xl'>
                    <img 
                    src={require('../img/7github.png')} 
                    alt="github logo"
                    className='w-full h-full filter invert object-contain'
                    />
                    <span className='font-mono text-base -ml-4 pl-6 pr-6 py-2 rounded-r-3xl'>erlonl</span>
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer;