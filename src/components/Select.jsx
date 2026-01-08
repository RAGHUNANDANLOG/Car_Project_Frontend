const Select = ({ 
  label, 
  error, 
  options = [], 
  placeholder = 'Select an option',
  className = '', 
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
      <div className="relative">
        <select
          className={`w-full px-4 py-3 bg-midnight-900/50 border rounded-xl text-white appearance-none cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-electric-500/50 focus:border-electric-500 ${
            error 
              ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500' 
              : 'border-slate-700/50 hover:border-slate-600'
          }`}
          {...props}
        >
          <option value="" className="bg-midnight-900">{placeholder}</option>
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              className="bg-midnight-900"
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-400 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
};

export default Select;



