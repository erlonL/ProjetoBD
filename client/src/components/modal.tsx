import React, { ReactNode } from 'react';

interface ModalType {
    children?: ReactNode;
    isOpen: boolean;
    toggle: () => void;
}

export default function Modal({ children, isOpen, toggle }: ModalType) {
    return (
        <>
            <div className='modal-overlay z-auto w-full h-full absolute top-0 bg-slate-300 flex justify-center items-center'>
                <div className='block bg-white w-{70}'>
                    {children}
                </div>
            </div>
        </>
    );
}