export type RenderMode = 'auto' | 'children';

export interface DemoConfig {
  // Render mode
  renderMode: RenderMode;

  // Simulation
  simulateSlowSubmission: boolean;
  simulateEndpointError: boolean;

  // Debug
  showDebugMode: boolean;
}

export interface ThemeColors {
  background: string;
  foreground: string;
  disabledBackground: string;
  placeholder: string;
  border: string;
  ring: string;
  error: string;
  radius: string;
}

export const themes: Record<string, ThemeColors> = {
  default: {
    background: '#ffffff',
    foreground: '#0a0a0a',
    disabledBackground: '#f5f5f5',
    placeholder: '#9ca3af',
    border: '#e5e5e5',
    ring: '#3b82f6',
    error: '#ef4444',
    radius: '0.375rem',
  },
  dark: {
    background: '#1a1a2e',
    foreground: '#eaeaea',
    disabledBackground: '#16213e',
    placeholder: '#6b7280',
    border: '#0f3460',
    ring: '#3b82f6',
    error: '#f87171',
    radius: '0.375rem',
  },
  ocean: {
    background: '#f0f9ff',
    foreground: '#0c4a6e',
    disabledBackground: '#e0f2fe',
    placeholder: '#7dd3fc',
    border: '#bae6fd',
    ring: '#0284c7',
    error: '#ef4444',
    radius: '0.5rem',
  },
  forest: {
    background: '#f0fdf4',
    foreground: '#14532d',
    disabledBackground: '#dcfce7',
    placeholder: '#86efac',
    border: '#bbf7d0',
    ring: '#22c55e',
    error: '#ef4444',
    radius: '0.5rem',
  },
  sunset: {
    background: '#fff7ed',
    foreground: '#9a3412',
    disabledBackground: '#ffedd5',
    placeholder: '#fdba74',
    border: '#fed7aa',
    ring: '#ea580c',
    error: '#dc2626',
    radius: '0.25rem',
  },
};
