import style from './button.module.css';

type ButtonProps = {
    className?: string,
    onClick?: () => void,
    children: React.ReactNode,
    disabled?: boolean,
}

const Button = ({className, onClick, children, disabled}: ButtonProps) => (
    <button onClick={onClick} className={`${style.button} ${style[className || '']}`} disabled={disabled}>
        {children}
    </button>
);

export default Button;