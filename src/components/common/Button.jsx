const Button = ({ children, onClick, disabled = false, variant = 'primary', className = '', ...props }) => {
  const baseClasses = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  return (
    <button
      className={`${baseClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
