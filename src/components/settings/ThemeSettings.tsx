import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

export default function ThemeSettings() {
  const { theme, setTheme } = useContext(ThemeContext);

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">Theme Settings</h2>
      <div className="mt-2">
        <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
          Select Color Scheme
        </label>
        <select
          id="theme"
          value={theme}
          onChange={handleThemeChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System Default</option>
        </select>
      </div>
    </div>
  );
}
