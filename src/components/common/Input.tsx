interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
  }
  
  export const Input = ({ label, error, ...props }: InputProps) => {
    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input
          {...props}
          className={`w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
            ${error ? 'border-red-500' : 'border-gray-300'}`}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  };