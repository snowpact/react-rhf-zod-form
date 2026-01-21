import { type DemoConfig, type RenderMode } from './types';

interface ConfigPanelProps {
  config: DemoConfig;
  onConfigChange: <K extends keyof DemoConfig>(key: K, value: DemoConfig[K]) => void;
  onFillAsync: () => void;
  isLoadingAsync: boolean;
}

function ConfigCheckbox({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 mt-1 text-blue-500 rounded focus:ring-blue-500"
      />
      <div>
        <span className="font-medium">{label}</span>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </label>
  );
}

function RenderModeSelector({
  value,
  onChange,
}: {
  value: RenderMode;
  onChange: (mode: RenderMode) => void;
}) {
  const modes: { value: RenderMode; label: string; description: string }[] = [
    { value: 'auto', label: 'Auto', description: 'Automatic field rendering' },
    { value: 'children', label: 'Children', description: 'Custom layout with render function' },
  ];

  return (
    <div className="flex gap-2">
      {modes.map(mode => (
        <button
          key={mode.value}
          onClick={() => onChange(mode.value)}
          className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-all ${
            value === mode.value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
          }`}
          title={mode.description}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}

export function ConfigPanel({
  config,
  onConfigChange,
  onFillAsync,
  isLoadingAsync,
}: ConfigPanelProps) {
  return (
    <div className="bg-gray-700 text-white p-4 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 border-b border-gray-500 pb-2">Config Panel</h2>

      {/* Render Mode Section */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Render Mode</h3>
        <RenderModeSelector
          value={config.renderMode}
          onChange={mode => onConfigChange('renderMode', mode)}
        />
        <p className="text-xs text-gray-400 mt-2">
          {config.renderMode === 'auto'
            ? 'Fields are rendered automatically from schema'
            : 'Use children function for custom field layout'}
        </p>
      </div>

      {/* Simulation Section */}
      <div className="mb-6 pt-4 border-t border-gray-500">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Simulation</h3>
        <div className="space-y-4">
          <ConfigCheckbox
            label="Simulate Slow Submission"
            description="2s delay to show loading state"
            checked={config.simulateSlowSubmission}
            onChange={() => onConfigChange('simulateSlowSubmission', !config.simulateSlowSubmission)}
          />
          <ConfigCheckbox
            label="Simulate Endpoint Error"
            description="Server errors on firstName & email"
            checked={config.simulateEndpointError}
            onChange={() => onConfigChange('simulateEndpointError', !config.simulateEndpointError)}
          />
        </div>
      </div>

      {/* Debug Section */}
      <div className="mb-6 pt-4 border-t border-gray-500">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Debug</h3>
        <ConfigCheckbox
          label="Debug Mode"
          description="Log form values to console"
          checked={config.showDebugMode}
          onChange={() => onConfigChange('showDebugMode', !config.showDebugMode)}
        />
      </div>

      {/* Actions Section */}
      <div className="pt-4 border-t border-gray-500">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Actions</h3>
        <button
          onClick={onFillAsync}
          disabled={isLoadingAsync}
          className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-wait text-white text-sm font-medium rounded transition-colors"
        >
          {isLoadingAsync ? 'Loading...' : 'Fill with async data'}
        </button>
      </div>
    </div>
  );
}
