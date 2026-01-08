const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizes[size]} relative`}>
        <div className="absolute inset-0 rounded-full border-4 border-midnight-700" />
        <div className="absolute inset-0 rounded-full border-4 border-electric-500 border-t-transparent animate-spin" />
      </div>
    </div>
  );
};

export default LoadingSpinner;



