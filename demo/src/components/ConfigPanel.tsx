import type { DemoConfig } from './types';

interface ConfigPanelProps {
  config: DemoConfig;
  onToggle: (key: keyof DemoConfig) => void;
  onFillAsync: () => void;
  isLoadingAsync: boolean;
}

export function ConfigPanel({ config, onToggle, onFillAsync, isLoadingAsync }: ConfigPanelProps) {
  return (
    <div className="bg-gray-700 text-white p-4 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 border-b border-gray-500 pb-2">
        Config Panel
      </h2>

      <div className="space-y-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={config.simulateEndpointError}
            onChange={() => onToggle('simulateEndpointError')}
            className="w-4 h-4 mt-1 text-blue-500 rounded focus:ring-blue-500"
          />
          <div>
            <span className="font-medium">Simulate Endpoint Error</span>
            <p className="text-sm text-gray-400">
              Server errors on firstName & email
            </p>
          </div>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={config.simulateSlowSubmission}
            onChange={() => onToggle('simulateSlowSubmission')}
            className="w-4 h-4 mt-1 text-blue-500 rounded focus:ring-blue-500"
          />
          <div>
            <span className="font-medium">Simulate Slow Submission</span>
            <p className="text-sm text-gray-400">
              2s delay to show loading state
            </p>
          </div>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={config.showDebugMode}
            onChange={() => onToggle('showDebugMode')}
            className="w-4 h-4 mt-1 text-blue-500 rounded focus:ring-blue-500"
          />
          <div>
            <span className="font-medium">Debug Mode</span>
            <p className="text-sm text-gray-400">
              Log form values to console
            </p>
          </div>
        </label>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-500">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Actions</h3>
        <button
          onClick={onFillAsync}
          disabled={isLoadingAsync}
          className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-wait text-white text-sm font-medium rounded transition-colors"
        >
          {isLoadingAsync ? 'Loading...' : 'Fill with async data'}
        </button>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-500">
        <h3 className="text-sm font-semibold text-gray-300 mb-2">Field Types</h3>
        <div className="flex flex-wrap gap-1 text-xs">
          {[
            'text', 'email', 'password', 'number', 'textarea',
            'select', 'checkbox', 'radio', 'date', 'time',
            'datetime-local', 'file', 'tel', 'url', 'color', 'hidden',
          ].map(type => (
            <code key={type} className="bg-gray-600 px-1.5 py-0.5 rounded">
              {type}
            </code>
          ))}
        </div>
      </div>
    </div>
  );
}
