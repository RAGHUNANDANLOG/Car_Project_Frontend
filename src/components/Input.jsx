const Input = ({ 
  label, 
  error, 
  className = '', 
  type = 'text',
  ...props 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-300">
          {label}
          {props.required && <span className="text-neon-pink ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        className={`w-full px-4 py-3 bg-midnight-900/50 border rounded-xl text-white placeholder-slate-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-electric-500/50 focus:border-electric-500 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert ${
          error 
            ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500' 
            : 'border-slate-700/50 hover:border-slate-600'
        }`}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-400 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
};

export default Input;
