const Card = ({ 
  children, 
  className = '', 
  hover = false,
  glow = null,
  ...props 
}) => {
  const glowStyles = {
    blue: 'hover:shadow-electric-500/20 hover:shadow-lg',
    pink: 'hover:shadow-neon-pink/20 hover:shadow-lg',
    green: 'hover:shadow-neon-green/20 hover:shadow-lg',
  };

  return (
    <div
      className={`bg-midnight-900/50 border border-white/5 rounded-2xl backdrop-blur-sm transition-all duration-300 ${
        hover ? 'hover:border-white/10 hover:bg-midnight-800/50' : ''
      } ${glow ? glowStyles[glow] : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;



