import { Menu } from '@headlessui/react';
import { PaintBrushIcon } from '@heroicons/react/24/outline';
import ThemeCustomizer from './ThemeCustomizer';

export default function ThemeToggle() {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="rounded-full p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
        <PaintBrushIcon className="h-5 w-5" />
      </Menu.Button>

      <Menu.Items className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white p-6 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <ThemeCustomizer />
      </Menu.Items>
    </Menu>
  );
}