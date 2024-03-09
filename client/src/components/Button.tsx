
type ButtonProps = {
    onClick: () => void;
    label: string;
}

const Button: React.FC<ButtonProps> = ({onClick, label}) => {
    return (
        <button className='bg-slate-200 p-2 m-2 rounded-lg' onClick={onClick}>
            {label}
        </button>
    );
}
export default Button;