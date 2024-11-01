import { ThemeContext } from '../../context/theme-context';
import { RadioGroup } from '@headlessui/react';
import { Switch } from '@headlessui/react';
import { ThemeSettings } from '../../lib/types';
import { useContext } from 'react';

export default function ThemeCustomizer() {
  const { theme, updateTheme } = useContext(ThemeContext);

  const colorSchemes = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' }
  ];

  const primaryColors = [
    { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' },
    { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
    { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
    { value: 'rose', label: 'Rose', class: 'bg-rose-500' },
    { value: 'emerald', label: 'Emerald', class: 'bg-emerald-500' }
  ];

  const fontSizes = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' }
  ];

  const cardStyles = [
    { value: 'minimal', label: 'Minimal' },
    { value: 'bordered', label: 'Bordered' },
    { value: 'elevated', label: 'Elevated' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Color Scheme</h3>
        <RadioGroup
          value={theme.colorScheme}
          onChange={value => updateTheme({ colorScheme: value as ThemeSettings['colorScheme'] })}
          className="mt-2"
        >
          <div className="flex gap-4">
            {colorSchemes.map(scheme => (
              <RadioGroup.Option
                key={scheme.value}
                value={scheme.value}
                className={({ active, checked }) =>
                  `${active ? 'ring-2 ring-offset-2 ring-offset-white ring-indigo-500' : ''}
                   ${checked ? 'bg-indigo-600 text-white' : 'bg-white text-gray-900'}
                   relative flex cursor-pointer rounded-lg px-4 py-2 shadow-md focus:outline-none`
                }
              >
                {({ checked }) => (
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      {scheme.label}
                    </div>
                    {checked && (
                      <div className="shrink-0 text-white">
                        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="12" fill="#fff" fillOpacity="0.2" />
                          <path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>

      <div>
        <h3 className="text-lg font-medium">Primary Color</h3>
        <RadioGroup
          value={theme.primaryColor}
          onChange={value => updateTheme({ primaryColor: value as ThemeSettings['primaryColor'] })}
          className="mt-2"
        >
          <div className="flex gap-3">
            {primaryColors.map(color => (
              <RadioGroup.Option
                key={color.value}
                value={color.value}
                className={({ active }) =>
                  `${active ? 'ring-2 ring-offset-2 ring-offset-white' : ''}
                   relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full focus:outline-none ${
                     color.class
                   }`
                }
              >
                {({ checked }) => (
                  <div>
                    {checked && (
                      <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                        <path d="M7 13l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>

      <div>
        <h3 className="text-lg font-medium">Font Size</h3>
        <RadioGroup
          value={theme.fontSize}
          onChange={value => updateTheme({ fontSize: value as ThemeSettings['fontSize'] })}
          className="mt-2"
        >
          <div className="flex gap-4">
            {fontSizes.map(size => (
              <RadioGroup.Option
                key={size.value}
                value={size.value}
                className={({ active, checked }) =>
                  `${active ? 'ring-2 ring-offset-2 ring-offset-white ring-indigo-500' : ''}
                   ${checked ? 'bg-indigo-600 text-white' : 'bg-white text-gray-900'}
                   relative flex cursor-pointer rounded-lg px-4 py-2 shadow-md focus:outline-none`
                }
              >
                <div className="text-sm">
                  {size.label}
                </div>
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>

      <div>
        <h3 className="text-lg font-medium">Card Style</h3>
        <RadioGroup
          value={theme.cardStyle}
          onChange={value => updateTheme({ cardStyle: value as ThemeSettings['cardStyle'] })}
          className="mt-2"
        >
          <div className="flex gap-4">
            {cardStyles.map(style => (
              <RadioGroup.Option
                key={style.value}
                value={style.value}
                className={({ active, checked }) =>
                  `${active ? 'ring-2 ring-offset-2 ring-offset-white ring-indigo-500' : ''}
                   ${checked ? 'bg-indigo-600 text-white' : 'bg-white text-gray-900'}
                   relative flex cursor-pointer rounded-lg px-4 py-2 shadow-md focus:outline-none`
                }
              >
                <div className="text-sm">
                  {style.label}
                </div>
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>

      <div>
        <Switch.Group>
          <div className="flex items-center justify-between">
            <Switch.Label className="text-lg font-medium">
              Show Preview Content
            </Switch.Label>
            <Switch
              checked={theme.showPreviewContent}
              onChange={value => updateTheme({ showPreviewContent: value })}
              className={`${
                theme.showPreviewContent ? 'bg-indigo-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  theme.showPreviewContent ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>
        </Switch.Group>
      </div>
    </div>
  );
}