const Skeleton = ({
  variant = 'text',
  width = '100%',
  height,
  className = ''
}) => {
  const getHeight = () => {
    if (height) return height;
    if (variant === 'text') return '1em';
    if (variant === 'title') return '2em';
    if (variant === 'rect') return '200px';
    if (variant === 'circle') return '40px';
    return 'auto';
  };

  const variantClasses = {
    text: 'rounded',
    title: 'rounded',
    rect: 'rounded-lg',
    circle: 'rounded-full'
  };

  return (
    <div
      className={`skeleton ${variantClasses[variant]} ${className}`}
      style={{
        width: variant === 'circle' ? getHeight() : width,
        height: getHeight()
      }}
    />
  );
};

export default Skeleton;
