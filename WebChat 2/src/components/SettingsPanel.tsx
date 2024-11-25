import React from 'react';
import { Settings, ModelType } from '../types';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface SettingsPanelProps {
  settings: Settings;
  onClose: () => void;
  onUpdate: (settings: Settings) => void;
}

const AVAILABLE_MODELS: ModelType[] = [
  'gpt-4o',
  'gpt-4o-mini',
  'gpt-4',
  'gpt-4-turbo',
  'gpt-3.5-turbo',
  'o1-preview',
  'o1-mini'
];

export default function SettingsPanel({ settings, onClose, onUpdate }: SettingsPanelProps) {
  const handleChange = (key: keyof Settings, value: any) => {
    onUpdate({ ...settings, [key]: value });
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 20 }}
      className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-lg p-6 overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold dark:text-white">Settings</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
        >
          <X className="w-6 h-6 dark:text-white" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Interface Settings */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold dark:text-white">Interface</h3>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium dark:text-gray-300">Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => handleChange('theme', e.target.value)}
              className="w-full p-2 rounded border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium dark:text-gray-300">Font Size</label>
            <input
              type="number"
              value={settings.fontSize}
              onChange={(e) => handleChange('fontSize', Number(e.target.value))}
              className="w-full p-2 rounded border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              min={12}
              max={24}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => handleChange('notifications', e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600"
            />
            <label className="text-sm font-medium dark:text-gray-300">Enable Notifications</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.sound}
              onChange={(e) => handleChange('sound', e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600"
            />
            <label className="text-sm font-medium dark:text-gray-300">Enable Sound</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.markdown}
              onChange={(e) => handleChange('markdown', e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600"
            />
            <label className="text-sm font-medium dark:text-gray-300">Enable Markdown</label>
          </div>
        </section>

        {/* AI Model Settings */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold dark:text-white">AI Model</h3>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium dark:text-gray-300">Model</label>
            <select
              value={settings.model}
              onChange={(e) => handleChange('model', e.target.value)}
              className="w-full p-2 rounded border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {AVAILABLE_MODELS.map((model) => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium dark:text-gray-300">
              Temperature ({settings.temperature})
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={settings.temperature}
              onChange={(e) => handleChange('temperature', Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium dark:text-gray-300">
              Top P ({settings.top_p})
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.top_p}
              onChange={(e) => handleChange('top_p', Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium dark:text-gray-300">Max Tokens</label>
            <input
              type="number"
              value={settings.max_tokens || ''}
              onChange={(e) => handleChange('max_tokens', e.target.value ? Number(e.target.value) : null)}
              placeholder="No limit"
              className="w-full p-2 rounded border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium dark:text-gray-300">
              Presence Penalty ({settings.presence_penalty})
            </label>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={settings.presence_penalty}
              onChange={(e) => handleChange('presence_penalty', Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium dark:text-gray-300">
              Frequency Penalty ({settings.frequency_penalty})
            </label>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={settings.frequency_penalty}
              onChange={(e) => handleChange('frequency_penalty', Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.stream}
              onChange={(e) => handleChange('stream', e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600"
            />
            <label className="text-sm font-medium dark:text-gray-300">Enable Streaming</label>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium dark:text-gray-300">Language</label>
            <select
              value={settings.language}
              onChange={(e) => handleChange('language', e.target.value)}
              className="w-full p-2 rounded border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="pt-br">Português (Brasil)</option>
              <option value="en">English</option>
            </select>
          </div>
        </section>
      </div>
    </motion.div>
  );
}